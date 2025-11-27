// 라이브 콜백
export interface LivePayload {
  version: string;
  service_account_key: string;
  channel_key: string;
  stream_key: string;
  broadcast_key: string;
  broadcast_state: 'start' | 'stop' | 'pause' | 'resume';
}