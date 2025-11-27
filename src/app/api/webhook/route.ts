import { mapStreamEventToStream } from '@/lib/mapStreamEventToStream';
import { insertStreamEvent, upsertStream } from '@/lib/streams';
import { StreamEvent } from '@/types/streamEvent';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  let rawBody: string;
  try {
    rawBody = await request.text();
    console.log('라이브 콜백 POST body:', rawBody);
  } catch (error) {
    console.error('Failed to read POST body:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  // 문자열을 key=value 형태로 파싱
  const params = new URLSearchParams(rawBody);
  const payload = Object.fromEntries(params.entries()) as any;
  console.log('Parsed payload:', payload);

  // 필수 필드 체크
  const { broadcast_key, broadcast_state, channel_key, stream_key, version } = payload;
  if (!broadcast_key || !broadcast_state || !channel_key || !stream_key) {
    console.warn('페이로드 필드 부족');
    return NextResponse.json({ message: 'Missing required fields in payload' }, { status: 400 });
  }

  const streamEvent: StreamEvent = {
    version,
    channel_key,
    stream_key,
    broadcast_key,
    broadcast_state
  };

  try {
    // 1. 원본 이벤트 저장
    await insertStreamEvent(streamEvent);

    // 2. 화면용 streams insert/update
    const streamRecord = mapStreamEventToStream(streamEvent);
    await upsertStream(streamRecord);

    return NextResponse.json({ message: '라이브 콜백 처리 완료' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
