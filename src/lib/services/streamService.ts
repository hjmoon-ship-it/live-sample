import { supabase } from '@/lib/supabase';
import { Stream } from '@/types/stream';
import { fetchLiveStreams, updateVeiwerCountByBroadcastKey } from '@/lib/db/streams';
import { LiveCallback } from '@/types/liveCallback';
import { Broadcast } from '@/types/broadcast';
import { fetchLmsCallbackByMediaContentKey } from '../db/lmsCallbacks';

export const streamService = {

  // 실시간 구독 (streams 테이블 변경 감지)
  subscribeLiveStreams(onUpdate: (streams: Stream[]) => void) {
    const latestPerChannel = new Map<string, Stream>();
    let active = true;

    const updateStreamsState = () => {
      if (!active) return;
      const sorted = Array.from(latestPerChannel.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      onUpdate(sorted);
    };

    // 초기 fetch: 모든 방송 가져오기
    fetchLiveStreams()
      .then(data => {
        if (!active) return;
        data.forEach(stream => {
          latestPerChannel.set(stream.channel_key, stream);
        });
        updateStreamsState();
      })
      .catch(err => console.error(err));

    // 실시간 구독
    const subscription = supabase
      .channel('public:streams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streams' }, payload => {
        if (!active || !payload.new) return;
        const updatedStream = payload.new as Stream;

        // Map 업데이트
        latestPerChannel.set(updatedStream.broadcast_key, updatedStream);
        updateStreamsState();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(subscription);
    };
  },

  makeStream(liveCallback: LiveCallback, broadcastInfo: Broadcast): Stream {
    let status: Stream['status'];
    switch (liveCallback.broadcast_state) {
      case 'start':
      case 'resume':
        status = 'LIVE';
        break;
      case 'stop':
      case 'pause':
        status = 'ENDED';
        break;
      default:
        status = 'ENDED';
    }

    return {
      broadcast_key: liveCallback.broadcast_key,
      channel_key: liveCallback.channel_key,
      title: broadcastInfo.title,
      channel_name: broadcastInfo.channel.title,
      status,
      created_at: new Date().toISOString(),
    };
  },

  // 시청자 수 업데이트
  async updateViewerCount(broadcast_key: string) {
    const activeViewers = await fetchLmsCallbackByMediaContentKey(broadcast_key);
    if (!activeViewers || activeViewers.length === 0) {
      throw new Error('No active viewers found');
    }

    // 중복 제거 후 동접 수
    const viewer_count = new Set(activeViewers.map(v => v.client_user_id)).size;
    await updateVeiwerCountByBroadcastKey(viewer_count, broadcast_key);
  }
};