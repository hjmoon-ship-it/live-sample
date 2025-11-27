'use client';
import { SidebarStreamCard } from '@/components/SidebarStreamCard';
import { StreamCard } from '@/components/StreamCard';
import { Stream } from '@/types/stream';
import { Radio } from 'lucide-react';
import { useLiveStreams } from '@/hooks/useLiveStreams';

export default function HomePage() {
  // 실시간 방송 데이터
  const liveStreams: Stream[] = useLiveStreams();

  // 메인 방송 + 사이드 방송 분리
  const latestStream = liveStreams[0];
  const sidebarStreams = liveStreams.slice(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-7xl mx-auto p-5 md:p-8">
        <header className="py-4 border-b border-gray-700 mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center mb-2">
            <Radio className="w-7 h-7 mr-2 text-[#00FFA3] fill-[#00FFA3]" />
            실시간 라이브 홈
            <span className="text-[#00FFA3] ml-2">({liveStreams.length}개 방송 중)</span>
          </h1>
        </header>

        {/* 방송 없을 때 */}
        {liveStreams.length === 0 ? (
          <div className="text-center p-20 bg-gray-800 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-200">방송 중인 라이브 채널이 없습니다.</h2>
            <p className="text-gray-400 mt-2">지금 바로 새로운 라이브 방송을 시작해보세요!</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-300 mb-4 border-l-4 border-[#00FFA3] pl-3">주목할 만한 라이브 채널</h2>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 mb-10">
              {/* 메인 방송 */}
              <div className="lg:col-span-9">
                {latestStream && <StreamCard stream={latestStream} />}
              </div>

              {/* 사이드 방송 목록 */}
              {sidebarStreams.length > 0 && (
                <div className="lg:col-span-3 bg-gray-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2 mb-3">
                    다른 라이브 채널 ({sidebarStreams.length})
                  </h3>

                  <div className="space-y-3 lg:max-h-[70vh] lg:overflow-y-auto">
                    {sidebarStreams.map((stream) => (
                      <SidebarStreamCard key={stream.broadcast_key} stream={stream} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        <footer className="mt-16 pt-8 border-t border-gray-800 text-xs text-gray-600 text-center">
          <p>© {new Date().getFullYear()} Catenoid.</p>
        </footer>
      </div>
    </div>
  );
}