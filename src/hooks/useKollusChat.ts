'use client';
import { useEffect, useRef, useState } from 'react';

export const useKollusChat = (broadcast_key: string) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sdk, setSdk] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://file.kollus.com/kollusChatting/sdk/KOLLUS_CHATTING_SDK.latest.js';
    script.async = true;
    script.onload = () => {
      console.log('Kollus Chat SDK loaded');
      setSdk(window.KOLLUS_CHATTING_SDK);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!sdk || !chatContainerRef.current) return;

    // Player 연결된 상태의 controller 필요
    // 예시: VGControllerClient와 함께 연결
    const controller = new (window as any).VgControllerClient({
      target_window: (document.getElementById('kollus_player') as HTMLIFrameElement).contentWindow,
    });

    controller.on('ready', () => {
      const chatInstance = sdk.getKollusSDK(controller);

      chatInstance.on('join', (messages: any[]) => {
        console.log('Previous messages:', messages);
      });

      chatInstance.on('chat', (msg: any) => {
        console.log('New chat:', msg);
      });

      // 연결 시작
      chatInstance.startConnection();

      // 언마운트 시 정리
      return () => {
        chatInstance.disposeConnection();
      };
    });
  }, [sdk, broadcast_key]);

  return { chatContainerRef, sdk };
};
