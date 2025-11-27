import { ChatMessage } from "@/types/chatMessage";

// 사용할 색 배열
const colors = [
  "#00FFA3", "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF85A2",
  "#FFB347", "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F", "#DC7633",
  "#E74C3C", "#58D68D", "#AF7AC5", "#F5B7B1", "#45B39D", "#F39C12",
  "#5499C7", "#EC7063", "#BB8FCE", "#52BE80", "#F7DC6F", "#D98880",
  "#1ABC9C", "#E67E22", "#3498DB", "#9B59B6", "#2ECC71", "#E74C3C"
];

const nicknameColorMap = new Map<string, string>();

const getColorByNickname = (nickname: string) => {
  if (nicknameColorMap.has(nickname)) {
    return nicknameColorMap.get(nickname)!;
  }
  const color = colors[Math.floor(Math.random() * colors.length)];
  nicknameColorMap.set(nickname, color);
  return color;
};

export const ChatMessageItem = ({ msg }: { msg: ChatMessage }) => {
  const color = msg.color === "#FFFFFF" ? "#FFFFFF" : getColorByNickname(msg.user);

  return (
    <div className="flex text-sm leading-snug">
      <span className="font-bold mr-2" style={{ color }}>
        {msg.user}:
      </span>
      <span className="text-gray-200 break-words">{msg.content}</span>
    </div>
  );
};
