import { Users } from "lucide-react";

interface LivePlayerProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  jwt: string;
  viewerCount?: number;
  customKey: string;
}

export const LivePlayer = ({
  iframeRef,
  jwt,
  viewerCount = 0,
  customKey,
}: LivePlayerProps) => (
  <div className="aspect-video bg-black rounded-xl relative shadow-xl">
    <iframe
      ref={iframeRef}
      id="live_player_iframe"
      src={`https://v-live-kr.kollus.com/s?jwt=${jwt}&custom_key=${customKey}&autoplay=true&nochat=1&player_version=html5`}
      className="w-full h-full"
      allow="autoplay; fullscreen"
    />
    <div className="absolute top-4 left-4 flex space-x-3">
      <span className="flex items-center bg-black/60 px-3 py-1 rounded-full text-sm text-white">
        <Users className="w-4 h-4 mr-1" /> {viewerCount} 명 시청 중
      </span>
    </div>
  </div>
);
