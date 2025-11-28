'use client';
import { useEffect, useState } from "react";
import { liveClientService } from "@/lib/services/liveClientService";

export const useJwt = (channel_key?: string, client_user_id?: string) => {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    if (!channel_key || !client_user_id) return;

    const fetchJwt = async () => {
      try {
        const jwt = await liveClientService.getJwt(channel_key, client_user_id);
        setJwt(jwt ?? null);
      } catch (error) {
        console.error('JWT fetch failed', error);
        setJwt(null);
      }
    };

    fetchJwt();
  }, [channel_key, client_user_id]);

  return jwt;
};
