'use client';
import { ChatPanel } from "@/components/Chat/ChatPanel";
import { LivePlayer } from "@/components/LivePlayer";
import { StreamInfo } from "@/components/StreamInfo";
import { StreamMeta } from "@/components/StreamMeta";
import { useClientUserId } from "@/hooks/useClientUserId";
import { useJwt } from "@/hooks/useJwt";
import { useLiveStream } from "@/hooks/useLiveStream";
import { ChatMessage } from "@/types/chatMessage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function LiveStreamPage() {
  const CUSTOM_KEY = process.env.NEXT_PUBLIC_KOLLUS_CUSTOM_KEY!;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = useParams<{ broadcast_key: string }>();
  const broadcastKey = params.broadcast_key;

  const { stream, loading, error } = useLiveStream(broadcastKey);
  const clientUserId = useClientUserId();
  const jwt = useJwt(stream?.channel_key ?? '', clientUserId ?? '');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sdk, setSdk] = useState<any>(null);

  if (loading || !stream || !jwt)
    return <div className="min-h-screen flex items-center justify-center text-white">로딩중...</div>;
  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Header */}
      <header className="py-3 px-4 lg:px-8 border-b border-gray-800 flex justify-between items-center sticky top-0 z-10 bg-gray-900">
        <Link href="/">
          <div className="text-xl font-bold text-white cursor-pointer">
            파지직
          </div>
        </Link>
      </header>

      {/* Main */}
      <div className="flex-grow w-full max-w-[1920px] mx-auto">

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          <main className="lg:col-span-9 p-4 lg:p-8 overflow-y-auto">
            <LivePlayer iframeRef={iframeRef} jwt={jwt} viewerCount={stream?.viewer_count} customKey={CUSTOM_KEY} />
            <StreamInfo stream={stream} />
            <StreamMeta stream={stream} />
          </main>

          <aside className="lg:col-span-3 h-full max-h-[calc(100vh-56px)] sticky top-[56px]">
            <ChatPanel
              iframeRef={iframeRef}
              messages={messages}
              setMessages={setMessages}
              sdk={sdk}
              setSdk={setSdk}
            />
          </aside>
        </div>

        {/* Mobile */}
        <div className="flex flex-col lg:hidden h-[calc(100vh-56px)]">
          <div className="flex-1">
            <LivePlayer iframeRef={iframeRef} jwt={jwt} viewerCount={stream?.viewer_count} customKey={CUSTOM_KEY} />
            <div className="px-4">
              <StreamInfo stream={stream} />
              <StreamMeta stream={stream} />
            </div>
          </div>
          <div className="flex-1 border-t border-gray-800 overflow-y-auto">
            <ChatPanel
              iframeRef={iframeRef}
              messages={messages}
              setMessages={setMessages}
              sdk={sdk}
              setSdk={setSdk}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
