// Stream 테이블
export interface Stream {
    broadcast_key: string;
    title: string;
    channel_key: string;
    status: 'LIVE' | 'ENDED';
    created_at: string;
}