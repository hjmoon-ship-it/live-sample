import { insertLiveCallback } from '@/lib/db/liveCallbacks';
import { upsertStream } from '@/lib/db/streams';
import { LiveCallback } from '@/types/liveCallback';
import { NextResponse } from 'next/server';
import { liveServerService } from "@/lib/services/liveServerService";
import { streamService } from '@/lib/services/streamService';

export async function POST(request: Request) {

  let rawBody: string;
  try {
    rawBody = await request.text();
    console.log('라이브 콜백 POST body:', rawBody);
  } catch (error) {
    console.error('Failed to read POST body:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  // key=value 형태로 파싱
  const params = new URLSearchParams(rawBody);
  const payload = Object.fromEntries(params.entries()) as Record<string, any>;
  console.log('Parsed payload:', payload);

  // 필수 필드 체크
  const { version, service_account_key, channel_key, stream_key, broadcast_key, broadcast_state } = payload;

  if (!version || !service_account_key || !channel_key || !stream_key || !broadcast_key || !broadcast_state) {
    console.warn('페이로드 필드 부족');
    return NextResponse.json({ message: 'Missing fields in payload' }, { status: 400 });
  }

  // LiveCallback 객체 생성
  const liveCallback: LiveCallback = {
    version,
    service_account_key,
    channel_key,
    stream_key,
    broadcast_key,
    broadcast_state,
  };

  // 방송 정보 조회
  const broadcastInfo = await liveServerService.getBroadcastInfo(broadcast_key);

  // stream 생성
  const stream = streamService.makeStream(liveCallback, broadcastInfo);

  try {

    // LiveCallback DB 저장
    await insertLiveCallback(liveCallback);

    // DB upsert
    await upsertStream(stream);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Supabase insert/upsert error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
