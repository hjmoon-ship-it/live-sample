export interface Broadcast {
  id: number;
  key: string;
  title: string;
  is_onair: boolean;
  subscribe_url: string;
  duration: string;
  counting_number: number;
  channel: Channel;
  profile_group: ProfileGroup;
  idle_screen_kind: IdleScreenKind;
  recording_file_policy: RecordingFilePolicy;
  recording_file_segment_policy: RecordingFileSegmentPolicy;
  media_player_policy: MediaPlayerPolicy;
  hided_at: string | null;
  created_at: string;
  updated_at: string;
  creator: Creator;
  duplicate_recording_state: DuplicateRecordingState;
  started_at: string | null;
  paused_at: string | null;
  ended_at: string | null;
}

export interface Channel {
  id: number;
  key: string;
  title: string;
  customer_code: string;
  concurrently_viewer_limit: number;
  kind: number;
  is_shared: boolean;
}

export interface ProfileGroup {
  meta_title_pattern: string;
  meta_description: string;
  logo_url: string;
  idle_screen_url: string;
}

export interface IdleScreenKind {
  publish_url: string;
  video_gateway_url: string;
}

export interface RecordingFilePolicy {
  recording_file_pattern: string;
}

export interface RecordingFileSegmentPolicy {
  recording_file_segment_by_size: number;
  recording_file_segment_by_duration: number;
}

export interface MediaPlayerPolicy {
  use_chatting_service: boolean;
  chatting_service: ChattingService;
}

export interface ChattingService {
  use_duplicate_block: boolean;
  use_capture_block: boolean;
  use_timeshift: boolean;
}

export interface Creator {
  // 필요하다면 필드 추가
}

export interface DuplicateRecordingState {
  streaming_server_type: string;
  streaming_server_host: string;
  streaming_server_ip: string;
  timeshift_cue_sign_at: string | null;
}
