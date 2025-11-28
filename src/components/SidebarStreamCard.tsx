'use client';
import { Stream } from '@/types/stream';
import { Users } from 'lucide-react';
import Link from 'next/link';

export const SidebarStreamCard = ({ stream }: { stream: Stream }) => {

    const snapshotUrl = `https://static.live.kr.kollus.com/static/hjmoon/${stream.channel_key}/snapshot.png`;

    return (
        <Link href={`/live/${stream.broadcast_key}`} className="flex items-center space-x-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors overflow-hidden">
            <div className="flex-shrink-0 w-12 h-12 bg-black rounded-md flex items-center justify-center overflow-hidden relative aspect-square">
                <img
                    src={snapshotUrl}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>

            <div className="flex-grow min-w-0">
                <p className="text-sm font-semibold text-white truncate">{stream.title}</p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{stream?.viewer_count} 명</span>
                </div>
            </div>
        </Link>);
};
