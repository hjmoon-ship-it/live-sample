import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ChatMessageItem } from "./ChatMessageItem"; // 경로 확인 필요
import { ChatMessage } from "@/types/chatMessage";
import generateNickname from 'ko-nickname';


declare global {
  interface Window {
    VgControllerClient: any;
    KOLLUS_CHATTING_SDK: any;
  }
}

interface ChatPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const ChatPanel = ({ iframeRef }: ChatPanelProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [vgLoaded, setVgLoaded] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [sdk, setSdk] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    const container = chatEndRef.current?.parentElement; // 채팅창 div
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const toChatMessage = (msg: any, isSelf: boolean): ChatMessage => {
    return {
      id: msg.userId + msg.ts,
      userId: msg.userId,
      user: msg.nickname ?? "익명",
      content: msg.message ?? "",
      color: isSelf ? "#FFFFFF" : undefined,
    };
  };

  const appendChatMsg = (msg: any) => {
    if (!configRef.current) {
      return;
    }
    const isSelf = msg.userId === configRef.current.getUserID();
    setMessages(prev => [...prev, toChatMessage(msg, isSelf)]);
    scrollToBottom();
  };

  const appendPrevChatMsg = (msg: any) => {
    const isSelf = configRef.current && msg.userId === configRef.current.getUserID();
    setMessages(prev => [...prev, toChatMessage(msg, isSelf)]);
    scrollToBottom();
  };

  const sendMessage = () => {
    if (!sdk) {
      console.error("SDK not initialized yet");
      return;
    }
    const message = input.trim();
    if (!message) return;

    try {
      const userData = "userData";

      sdk.sendMessage(message, userData);

      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const initSdk = () => {
    if (!window.KOLLUS_CHATTING_SDK || !window.VgControllerClient) {
      console.error("Scripts not fully loaded, init skipped.");
      return;
    }

    const iframe = document.getElementById("live_player_iframe") as HTMLIFrameElement;
    if (!iframe) {
      console.error("iframe not found");
      return;
    }

    const setupController = () => {
      if (!iframe.contentWindow) {
        console.error("iframe contentWindow not ready");
        return;
      }

      let Controller: any = window.VgControllerClient;
      if ("default" in window.VgControllerClient)
        Controller = window.VgControllerClient.default;

      const controller = new Controller({ target_window: iframe.contentWindow });

      controller.on("ready", () => {
        console.log("VG Controller ready");

        let kollusSdk;
        try {
          kollusSdk = window.KOLLUS_CHATTING_SDK.getKollusSDK(controller);
        } catch (err) {
          console.error("Failed to get Kollus SDK:", err);
          return;
        }

        setSdk(kollusSdk);

        const nickname = generateNickname();
        // const cfg = kollusSdk.getConfig().setNickname(nickname);

        // setConfig(cfg);
        configRef.current = kollusSdk.getConfig();
        configRef.current.setNickname(nickname);
        console.log(configRef.current);

        // 기존 메시지
        kollusSdk.on("join", (msgs: any[]) => msgs.forEach(appendPrevChatMsg));

        // 새로운 메시지
        kollusSdk.on("chat", (msg: any) => appendChatMsg(msg));

        kollusSdk.startConnection();
        console.log("Chat connection started");
      });
    };

    if (iframe.contentWindow && iframe.contentDocument?.readyState === "complete") {
      setupController();
    } else {
      iframe.addEventListener("load", setupController, { once: true });
    }
  };

  useEffect(() => {
    if (window.VgControllerClient) setVgLoaded(true);
    if (window.KOLLUS_CHATTING_SDK) setChatLoaded(true);
  }, []);

  useEffect(() => {
    if (vgLoaded && chatLoaded && iframeRef.current) {
      initSdk();
    }
  }, [vgLoaded, chatLoaded, iframeRef.current]);


  return (
    <>
      <Script
        src="https://file.kollus.com/vgcontroller/vg-controller-client.latest.min.js"
        strategy="afterInteractive"
        onLoad={() => setVgLoaded(true)}
      />

      <Script
        src="https://file.kollus.com/kollusChatting/sdk/KOLLUS_CHATTING_SDK.latest.js"
        strategy="afterInteractive"
        onLoad={() => setChatLoaded(true)}
      />

      <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800">
        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} msg={msg} />
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-gray-800 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!sdk}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-[#00FFA3]"
          />
          <button
            onClick={sendMessage}
            disabled={!sdk}
            className="bg-[#00FFA3] text-black font-bold px-4 py-2 rounded-lg hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
