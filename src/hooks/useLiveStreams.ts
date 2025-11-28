// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { Stream } from '@/types/stream';
// import { streamService } from '@/lib/services/streamService';

// export function useLiveStreams() {
//   const [streams, setStreams] = useState<Stream[]>([]);
//   // const pendingRef = useRef<Map<string, Stream>>(new Map()); // 30초 전 방송 대기
//   const intervalRef = useRef<number | null>(null);

//   useEffect(() => {
//     // 실시간 구독
//     const unsubscribe = streamService.subscribeLiveStreams((updatedStreams) => {
//       const now = new Date();

//       updatedStreams.forEach((s) => {
//         // const createdAt = new Date(s.created_at);

//         if (s.status !== 'LIVE') {
//           // ended 방송은 삭제
//           setStreams(prev => prev.filter(st => st.broadcast_key !== s.broadcast_key));
//           // pendingRef.current.delete(s.broadcast_key);
//         } else if (now.getTime() - createdAt.getTime() >= 30 * 1000) {
//           // 30초 지난 방송은 바로 streams에 반영 (기존 객체 덮어쓰기 가능)
//           setStreams(prev => {
//             const existsIndex = prev.findIndex(st => st.broadcast_key === s.broadcast_key);
//             if (existsIndex >= 0) {
//               const updated = [...prev];
//               updated[existsIndex] = s; // 기존 방송 덮어쓰기
//               return updated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             } else {
//               return [...prev, s].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             }
//           });
//           // pendingRef.current.delete(s.broadcast_key);
//         } else {
//           // 30초 안된 방송은 pending에 저장
//           // pendingRef.current.set(s.broadcast_key, s);
//         }
//       });
//     });

//     // pending 체크용 interval
//     // intervalRef.current = window.setInterval(() => {
//     //   const now = new Date();
//     //   pendingRef.current.forEach((s, key) => {
//     //     const createdAt = new Date(s.created_at);
//     //     if (now.getTime() - createdAt.getTime() >= 30 * 1000) {
//     //       setStreams(prev => {
//     //         const existsIndex = prev.findIndex(st => st.broadcast_key === s.broadcast_key);
//     //         if (existsIndex >= 0) {
//     //           const updated = [...prev];
//     //           updated[existsIndex] = s;
//     //           return updated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     //         } else {
//     //           return [...prev, s].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     //         }
//     //       });
//     //       pendingRef.current.delete(key);
//     //     }
//     //   });
//     // }, 30 * 1000);

//     return () => {
//       unsubscribe();
//       if (intervalRef.current) window.clearInterval(intervalRef.current);
//     };
//   }, []);

//   return streams;
// }

'use client';
import { useEffect, useState } from 'react';
import { Stream } from '@/types/stream';
import { streamService } from '@/lib/services/streamService';

export function useLiveStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    const unsubscribe = streamService.subscribeLiveStreams((updatedStreams) => {
      updatedStreams.forEach((s) => {
        if (s.status !== 'LIVE') {
          // 방송 종료 시 streams에서 삭제
          setStreams(prev => prev.filter(st => st.broadcast_key !== s.broadcast_key));
        } else {
          // LIVE 방송은 바로 반영 (기존 방송 덮어쓰기)
          setStreams(prev => {
            const existsIndex = prev.findIndex(st => st.broadcast_key === s.broadcast_key);
            if (existsIndex >= 0) {
              const updated = [...prev];
              updated[existsIndex] = s;
              return updated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            } else {
              return [...prev, s].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            }
          });
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return streams;
}
