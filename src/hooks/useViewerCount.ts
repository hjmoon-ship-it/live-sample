// 'use client';
// import { useEffect, useState } from "react";
// import { liveClientService } from "@/lib/services/liveClientService";

// export const useViewerCount = (broadcast_key: string) => {
//   const [viewerCount, setViewerCount] = useState(0);

//   useEffect(() => {
//     if (!broadcast_key) return;

//     const fetchCount = async () => {
//       try {
//         const now = new Date();
//         const start = new Date(now.getTime() - 10 * 1000); // 10초 전
//         const startDate = start.toISOString().replace("T", " ").split(".")[0];
//         const endDate = now.toISOString().replace("T", " ").split(".")[0];

//         const data = await liveClientService.getViewerCountByApi(broadcast_key, startDate, endDate);
//         setViewerCount(data?.max_cur_user ?? 0);
//       } catch (error) {
//         console.error('ViewerCount fetch failed', error);
//         setViewerCount(0);
//       }
//     };

//     fetchCount();
//     const interval = setInterval(fetchCount, 10 * 1000);

//     return () => clearInterval(interval);
//   }, [broadcast_key]);

//   return viewerCount;
// };
