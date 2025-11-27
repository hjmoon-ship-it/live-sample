import { supabase } from '@/lib/supabase';
import { StreamEvent } from '@/types/streamEvent';
import { Stream } from '@/types/stream';

const STREAM_EVENTS_TABLE = 'stream_events';
const STREAMS_TABLE = 'streams';

// stream_events insert
export async function insertStreamEvent(event: StreamEvent) {
  const { error } = await supabase.from(STREAM_EVENTS_TABLE).insert([event]);
  if (error) throw error;
}

// streams upsert
export async function upsertStream(stream: Stream) {
  const { data: existing, error } = await supabase
    .from(STREAMS_TABLE)
    .select('*')
    .eq('broadcast_key', stream.broadcast_key)
    .maybeSingle();

  if (error) throw error;

  if (!existing) {
    const { error: insertError } = await supabase.from(STREAMS_TABLE).insert([stream]);
    if (insertError) throw insertError;
  } else {
    const { error: updateError } = await supabase
      .from(STREAMS_TABLE)
      .update(stream)
      .eq('broadcast_key', stream.broadcast_key);
    if (updateError) throw updateError;
  }
}