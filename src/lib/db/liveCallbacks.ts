import { supabase } from '@/lib/supabase';
import { LiveCallback } from '@/types/liveCallback';

const LIVE_CALLBACKS_TABLE = 'live_callbacks';

export async function insertLiveCallback(event: LiveCallback) {
  const { error } = await supabase.from(LIVE_CALLBACKS_TABLE).insert([event]);
  if (error) throw error;
}

