import { supabase } from '@/lib/supabase';
import { Stream } from '@/types/stream';

const STREAMS_TABLE = 'streams';
// broadcast_key 기준으로 최신 데이터와 timeout 관리
const delayedStreams = new Map<string, { stream: Stream; timeoutId: NodeJS.Timeout }>();

export async function upsertStream(stream: Stream) {
  const { data: existing, error } = await supabase
    .from('streams')
    .select('*')
    .eq('broadcast_key', stream.broadcast_key)
    .maybeSingle();

  if (error) throw error;

  if (stream.status === 'LIVE' && !existing) {
    // 기존 timeout이 있으면 취소
    if (delayedStreams.has(stream.broadcast_key)) {
      clearTimeout(delayedStreams.get(stream.broadcast_key)!.timeoutId);
    }

    // 새로운 timeout 설정 (30초 후 insert)
    const timeoutId = setTimeout(async () => {
      try {
        const latest = delayedStreams.get(stream.broadcast_key)?.stream;
        if (!latest) return;

        const { error: insertError } = await supabase
          .from('streams')
          .insert([latest]);
        if (insertError) console.error('Delayed insert error:', insertError);
      } catch (e) {
        console.error('Delayed insert exception:', e);
      } finally {
        delayedStreams.delete(stream.broadcast_key);
      }
    }, 30 * 1000);

    delayedStreams.set(stream.broadcast_key, { stream, timeoutId });
  } else {
    // 기존 데이터가 있거나 LIVE가 아니면 바로 update
    const { error: updateError } = await supabase
      .from('streams')
      .update(stream)
      .eq('broadcast_key', stream.broadcast_key);

    if (updateError) throw updateError;
  }
}


// const delayedStreams = new Map<string, { stream: Stream, timeoutId: NodeJS.Timeout }>();

// export async function upsertStream(stream: Stream) {
//   const { data: existing, error } = await supabase
//     .from(STREAMS_TABLE)
//     .select('*')
//     .eq('broadcast_key', stream.broadcast_key)
//     .maybeSingle();

//   if (error) throw error;

//   if (!existing) {
//     // 기존 timeout이 있으면 취소
//     if (delayedStreams.has(stream.broadcast_key)) {
//       clearTimeout(delayedStreams.get(stream.broadcast_key)!.timeoutId);
//     }

//     // 새로운 timeout 설정 (30초 후 insert)
//     const timeoutId = setTimeout(async () => {
//       try {
//         // timeout 실행 시 Map에서 최신 stream 가져오기
//         const latest = delayedStreams.get(stream.broadcast_key)?.stream;
//         if (!latest) return;

//         const { error: insertError } = await supabase
//           .from(STREAMS_TABLE)
//           .insert([latest]);
//         if (insertError) console.error('Delayed insert error:', insertError);
//       } catch (e) {
//         console.error('Delayed insert exception:', e);
//       } finally {
//         delayedStreams.delete(stream.broadcast_key);
//       }
//     }, 30 * 1000);

//     // Map에 최신 데이터와 timeoutId 저장
//     delayedStreams.set(stream.broadcast_key, { stream, timeoutId });
//   } else {
//     // 기존 데이터는 바로 update
//     const { error: updateError } = await supabase
//       .from(STREAMS_TABLE)
//       .update(stream)
//       .eq('broadcast_key', stream.broadcast_key);
//     if (updateError) throw updateError;
//   }
// }

// DB에서 LIVE 방송 전체 조회 (최신순)
export async function fetchLiveStreams(): Promise<Stream[]> {
  // 현재 UTC 시간 기준
  const nowUtc = new Date();
  const thirtySecondsAgoUtc = new Date(nowUtc.getTime() - 30 * 1000); // 30초 전 UTC
  const iso30SecAgo = thirtySecondsAgoUtc.toISOString(); // "YYYY-MM-DDTHH:mm:ss.sssZ"

  const { data, error } = await supabase
    .from(STREAMS_TABLE)
    .select('*')
    .eq('status', 'LIVE')
    // .lt('created_at', iso30SecAgo)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}


// broadcast_key로 스트림 단건 조회
export async function fetchStreamByBroadcastKey(broadcast_key: string): Promise<Stream | null> {
  const { data, error } = await supabase
    .from(STREAMS_TABLE)
    .select('*')
    .eq('broadcast_key', broadcast_key)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function updateVeiwerCountByBroadcastKey(viewer_count: number, broadcast_key: string) {
  const { error } = await supabase
    .from('streams')
    .update({ viewer_count })
    .eq('broadcast_key', broadcast_key);

  if (error) throw error;
}
