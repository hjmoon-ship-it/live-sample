'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLiveStream } from '@/hooks/useLiveStream';
import { useJwt } from '@/hooks/useJwt';
import { useViewerCount } from '@/hooks/useViewerCount';
import { LivePlayer } from '@/components/LivePlayer';
import { StreamInfo } from '@/components/StreamInfo';
import { StreamMeta } from '@/components/StreamMeta';
import { ChatPanel } from '@/components/Chat/ChatPanel';

export default function LiveStreamPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = useParams<{ broadcast_key: string }>();
  const broadcast_key = params.broadcast_key;
  const CUSTOM_KEY = process.env.NEXT_PUBLIC_KOLLUS_CUSTOM_KEY;

  const { stream, loading, error } = useLiveStream(broadcast_key);
  const viewerCount = useViewerCount(stream?.broadcast_key ?? '');
  const jwt = useJwt(stream?.channel_key);

  const [showPlayer, setShowPlayer] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);


  // stream.create_at 기준으로 30초 이후 LivePlayer 렌더링
  useEffect(() => {
    if (!stream) return;

    const createdAt = new Date(stream.created_at).getTime();
    const now = Date.now();
    const diff = createdAt + 30000 - now; // 30초

    if (diff <= 0) {
      setShowPlayer(true); // 이미 지났으면 바로 렌더링
    } else {
      const timer = setTimeout(() => setShowPlayer(true), diff);
      return () => clearTimeout(timer); // cleanup
    }
  }, [stream]);

  if (loading || !stream || !jwt || !showPlayer)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        로딩중...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <header className="py-3 px-8 border-b border-gray-800 flex justify-between items-center sticky top-0 z-10 bg-gray-900">
        {/* Header 내용 */}
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 max-w-[1920px] mx-auto w-full">
        <main className="lg:col-span-9 p-4 lg:p-8 overflow-y-auto">
          <LivePlayer iframeRef={iframeRef} jwt={jwt} viewerCount={viewerCount} customKey={CUSTOM_KEY} />
          <StreamInfo stream={stream} />
          <StreamMeta stream={stream} />
        </main>

        <aside className="lg:col-span-3 h-full max-h-[calc(100vh-56px)] sticky top-[56px] hidden lg:block">
          <ChatPanel iframeRef={iframeRef} />
        </aside>
        {/* 모바일용 채팅 버튼 */}
        <footer className="lg:hidden p-4 border-t border-gray-800 text-center text-sm text-gray-600">
          <button
            className="bg-[#00FFA3] text-gray-900 w-full py-3 rounded-lg font-bold flex items-center justify-center"
            onClick={() => setMobileChatOpen(true)}
          >
            채팅 참여하기
          </button>
        </footer>

        {mobileChatOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
            <div className="bg-gray-900 w-full max-w-md h-2/3 rounded-lg p-4">
              <ChatPanel iframeRef={iframeRef} />
              <button
                className="mt-2 text-white"
                onClick={() => setMobileChatOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
