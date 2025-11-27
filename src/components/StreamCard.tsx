'use client';
import { useJwt } from '@/hooks/useJwt';
import { useViewerCount } from '@/hooks/useViewerCount';
import { Stream } from '@/types/stream';
import { PlayCircle, Radio, Users } from 'lucide-react';

export const StreamCard = ({ stream }: { stream: Stream }) => {

    const PREFIX = process.env.NEXT_PUBLIC_PREFIX ?? "";
    const CUSTOM_KEY = process.env.NEXT_PUBLIC_KOLLUS_CUSTOM_KEY;

    const jwt = useJwt(stream?.channel_key ?? '');
    const viewerCount = useViewerCount(stream?.broadcast_key ?? '');

    return (
        <div className="flex flex-col rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer overflow-hidden h-full bg-gray-700/50 border-4 border-[#00FFA3] shadow-[#00FFA3]/30 p-6">

            <div className="relative aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                {jwt ? (
                    <iframe
                        src={`https://v-live-kr.kollus.com/s?jwt=${jwt}&custom_key=${CUSTOM_KEY}&autoplay=true&mute&nochat=1&player_version=html5`}
                        className="w-full h-full"
                        allow="autoplay; fullscreen"
                    />
                ) : (
                    <PlayCircle className="w-16 h-16 text-white/50" />
                )}

                {/* iframe 클릭 시 이동 */}
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => window.location.href = `${PREFIX}/live/${stream.broadcast_key}`}
                />

                <div className="absolute top-2 left-2 flex items-center bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white z-20">
                    <Radio className="w-3 h-3 mr-1 fill-white" /> LIVE
                </div>
                <div className="absolute bottom-2 right-2 flex items-center bg-black/70 px-2 py-1 rounded-md text-sm font-medium text-white z-20">
                    <Users className="w-4 h-4 mr-1" /> {viewerCount} 명
                </div>
            </div>

            <div>
                <h3 className="font-extrabold text-white leading-tight text-3xl mb-2">
                    {stream.title}
                </h3>
                <p className="text-[#00FFA3] font-medium text-base mb-4">
                    🔥 현재 핫한 방송
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    시작 시간:{' '}
                    {new Date(stream.created_at).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>

    );
};
