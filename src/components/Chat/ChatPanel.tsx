import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ChatMessageItem } from "./ChatMessageItem";
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
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sdk: any;
  setSdk: React.Dispatch<React.SetStateAction<any>>;
}

export const ChatPanel = ({ iframeRef, messages, setMessages, sdk, setSdk }: ChatPanelProps) => {
  const configRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [vgLoaded, setVgLoaded] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const appendChatMsg = (msg: any) => {
    if (!configRef.current) return;
    const isSelf = msg.userId === configRef.current.getUserID();
    setMessages(prev => [...prev, { id: msg.userId + msg.ts, userId: msg.userId, user: msg.nickname ?? "익명", content: msg.message ?? "", color: isSelf ? "#FFFFFF" : undefined }]);
    scrollToBottom();
  };

  const initSdk = () => {
    if (!iframeRef.current || !window.KOLLUS_CHATTING_SDK || !window.VgControllerClient) return;

    const setupController = () => {
      if (!iframeRef.current?.contentWindow) return;

      let Controller: any = window.VgControllerClient;
      if ("default" in window.VgControllerClient) Controller = window.VgControllerClient.default;

      const controller = new Controller({ target_window: iframeRef.current.contentWindow });

      controller.on("ready", () => {
        let kollusSdk = window.KOLLUS_CHATTING_SDK.getKollusSDK(controller);
        setSdk(kollusSdk);

        const nickname = generateNickname();
        configRef.current = kollusSdk.getConfig();
        configRef.current.setNickname(nickname);

        kollusSdk.on("join", (msgs: any[]) => msgs.forEach(appendChatMsg));
        kollusSdk.on("chat", (msg: any) => appendChatMsg(msg));
        kollusSdk.startConnection();
      });
    };

    setupController();
  };

  useEffect(() => {
    if (window.VgControllerClient) setVgLoaded(true);
    if (window.KOLLUS_CHATTING_SDK) setChatLoaded(true);
  }, []);

  useEffect(() => {
    if (vgLoaded && chatLoaded) initSdk();
  }, [vgLoaded, chatLoaded]);

  return (
    <>
      <Script src="https://file.kollus.com/vgcontroller/vg-controller-client.latest.min.js" strategy="afterInteractive" onLoad={() => setVgLoaded(true)} />
      <Script src="https://file.kollus.com/kollusChatting/sdk/KOLLUS_CHATTING_SDK.latest.js" strategy="afterInteractive" onLoad={() => setChatLoaded(true)} />

      <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800">
        <div className="flex-1 p-4 space-y-3 overflow-y-auto" ref={chatContainerRef}>
          {messages.map(msg => <ChatMessageItem key={msg.id} msg={msg} />)}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-gray-800 flex gap-2 flex-col sm:flex-row">
          <input value={input} onChange={e => setInput(e.target.value)} disabled={!sdk} placeholder="메시지를 입력하세요" className="flex-1 min-w-0 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-[#00FFA3]" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sdk?.sendMessage(input, "userData"); setInput(""); } }} />
          <button onClick={() => { sdk?.sendMessage(input, "userData"); setInput(""); }} disabled={!sdk} className="w-full sm:w-auto bg-[#00FFA3] text-black font-bold px-4 py-2 rounded-lg hover:opacity-90">Send</button>
        </div>
      </div>
    </>
  );
};
