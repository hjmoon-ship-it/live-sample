'use client';
import { useEffect, useState } from 'react';
import { Stream } from '@/types/stream';
import { getLatestLiveStreams, subscribeLiveStreams } from '@/lib/services/streamService';

export function useLiveStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    // 초기 데이터 로드
    getLatestLiveStreams().then(setStreams);

    // 실시간 구독
    const unsubscribe = subscribeLiveStreams(setStreams);

    // 구독 해제
    return () => unsubscribe();
  }, []);

  return streams;
}
