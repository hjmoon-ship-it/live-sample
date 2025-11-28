import { supabase } from "@/lib/supabase";
import { LmsCallback } from "@/types/lmsCallback";

const LMS_CALLBACKS_TABLE = 'lms_callbacks';

export async function insertLmsCallback(callback: LmsCallback) {
  const { data, error } = await supabase
    .from(LMS_CALLBACKS_TABLE)
    .insert([callback]);

  if (error) throw error;
  return data;
}

export async function updateLmsCallback(id: string, updates: Partial<LmsCallback>) {
  const { data, error } = await supabase
    .from(LMS_CALLBACKS_TABLE)
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function getLmsCallbacksByUser(client_user_id: string) {
  const { data, error } = await supabase
    .from(LMS_CALLBACKS_TABLE)
    .select("*")
    .eq("client_user_id", client_user_id);

  if (error) throw error;
  return data;
}

export async function fetchLmsCallbackByMediaContentKey(media_content_key: string, timeoutSec = 300) {
  const nowSec = Math.floor(Date.now() / 1000);

  const { data, error } = await supabase
    .from('lms_callbacks')
    .select('client_user_id')
    .eq('media_content_key', media_content_key)
    .gte('start_at', nowSec - timeoutSec);

  if (error) throw error;

  return data;
}