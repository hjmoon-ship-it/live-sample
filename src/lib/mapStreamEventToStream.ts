import { StreamEvent } from '@/types/streamEvent';
import { Stream } from '@/types/stream';

export function mapStreamEventToStream(event: StreamEvent): Stream {
  // StreamEvent > Stream
  let status: Stream['status'];
  switch (event.broadcast_state) {
    case 'start':
    case 'resume':
      status = 'LIVE';
      break;
    case 'stop':
    case 'pause':
      status = 'ENDED';
      break;
    default:
      status = 'ENDED';
  }

  return {
    broadcast_key: event.broadcast_key,
    channel_key: event.channel_key,
    title: `${event.channel_key} / ${event.version}`,
    status,
    created_at: new Date().toISOString(),
  };
}
