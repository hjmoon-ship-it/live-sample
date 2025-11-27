'use client';
import { useState, useEffect } from 'react';
import { Stream } from '@/types/stream';
import { fetchStreamByBroadcastKey } from '@/lib/db/streams';

export function useLiveStream(broadcast_key: string) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!broadcast_key) return;

    const loadStream = async () => {
      setLoading(true);
      try {
        const data = await fetchStreamByBroadcastKey(broadcast_key);
        if (!data) throw new Error('Stream not found');
        setStream(data);
      } catch (e: any) {
        setError(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [broadcast_key]);

  return { stream, loading, error };
}