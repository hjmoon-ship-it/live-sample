import { LivePayload } from "./webhook";

// StreamEvent 테이블
export interface StreamEvent {
    version: string;
    channel_key: string;
    stream_key: string;
    broadcast_key: string;
    broadcast_state: LivePayload['broadcast_state'];
}