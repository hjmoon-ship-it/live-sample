'use client';
import { useEffect, useState } from "react";
import { liveService } from "@/lib/services/liveService";

export const useJwt = (channel_key?: string) => {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    if (!channel_key) return;

    liveService.getJwt(channel_key).then((data) => {
      setJwt(data.token);
    });
  }, [channel_key]);

  return jwt;
};
