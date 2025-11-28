export interface LmsCallback {
  client_user_id: string;
  start_at: string;
  run_time: string;
  show_time: string;
  media_content_key: string;
  host_name?: string;
  json_data?: Record<string, any>;
}
