import { supabase } from '@/lib/supabase';
import { Stream } from '@/types/stream';

// DB에서 LIVE 방송 전체 조회 (최신순)
export async function fetchLiveStreams(): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .eq('status', 'LIVE')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load live streams from DB:', error);
    return [];
  }
  return data ?? [];
}

// broadcast_key로 스트림 단건 조회
export async function fetchStreamByBroadcastKey(broadcast_key: string): Promise<Stream | null> {
  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .eq('broadcast_key', broadcast_key)
    .single();

  if (error) {
    console.error(`Failed to load stream with broadcast_key ${broadcast_key}:`, error);
    return null;
  }

  return data ?? null;
}