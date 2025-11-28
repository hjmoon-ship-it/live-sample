// Stream 테이블
export interface Stream {
    broadcast_key: string;
    title: string;
    channel_key: string;
    channel_name: string;
    viewer_count?: number;
    status: 'LIVE' | 'ENDED';
    created_at: string;
}