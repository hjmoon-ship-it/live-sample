import { supabase } from '@/lib/supabase';
import { Stream } from '@/types/stream';
import { fetchLiveStreams } from '@/lib/db/streams';

// 채널별 최신 LIVE 방송만 필터링
export async function getLatestLiveStreams(): Promise<Stream[]> {
  const data = await fetchLiveStreams();

  const latestPerChannel = new Map<string, Stream>();
  for (const stream of data) {
    if (!latestPerChannel.has(stream.channel_key)) {
      latestPerChannel.set(stream.channel_key, stream);
    }
  }

  return Array.from(latestPerChannel.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// 실시간 구독 (streams 테이블 변경 감지)
export function subscribeLiveStreams(
  onUpdate: (streams: Stream[]) => void
) {
  const latestPerChannel = new Map<string, Stream>();

  const updateStreamsState = () => {
    const sorted = Array.from(latestPerChannel.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    onUpdate(sorted);
  };

  const subscription = supabase
    .channel('public:streams')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'streams' },
      (payload) => {
        if (!payload.new) return;
        const updatedStream = payload.new as Stream;

        if (updatedStream.status === 'LIVE') {
          latestPerChannel.set(updatedStream.channel_key, updatedStream);
        } else {
          latestPerChannel.delete(updatedStream.channel_key);
        }
        updateStreamsState();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}