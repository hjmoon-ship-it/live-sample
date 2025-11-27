import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/types/chatMessage";

export const useChat = (initialMessages: ChatMessage[]) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user: "나뉴비으스마",
        role: "user",
        content: input.trim(),
        color: "#8e24aa",
      },
    ]);

    setInput("");
  };

  return { messages, input, setInput, sendMessage, chatEndRef };
};
