import { insertLmsCallback } from "@/lib/db/lmsCallbacks";
import { streamService } from "@/lib/services/streamService";
import { LmsCallback } from "@/types/lmsCallback";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://v-live-kr.kollus.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(request: Request) {

  let rawBody: string;
  try {
    rawBody = await request.text();
    console.log('lms 콜백 POST body:', rawBody);
  } catch (error) {
    console.error('Failed to read POST body:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400, headers: CORS_HEADERS });
  }

  // key=value 형태로 파싱
  const params = new URLSearchParams(rawBody);
  const payload = Object.fromEntries(params.entries()) as Record<string, any>;
  console.log('Parsed payload:', payload);

  // 필수 필드 체크
  const {
    client_user_id,
    start_at,
    run_time,
    show_time,
    media_content_key,
    host_name,
    json_data
  } = payload;

  if (!client_user_id || !start_at || !run_time || !show_time || !media_content_key || !host_name || !json_data) {
    console.warn('페이로드 필드 부족');
    return NextResponse.json({ message: 'Missing fields in payload' }, { status: 400, headers: CORS_HEADERS });
  }

  // LmsCallback 객체 생성
  const lmsCallback: LmsCallback = {
    client_user_id,
    start_at,
    run_time,
    show_time,
    media_content_key,
    host_name,
    json_data,
  };

  try {
    // LmsCallback DB 저장
    await insertLmsCallback(lmsCallback);

  } catch (error: any) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: CORS_HEADERS });
  }

  try {
    // update viewer count
    await streamService.updateViewerCount(media_content_key);

  } catch (error: any) {
    console.error("Failed to update viewer count:", error);
  }

  return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
}
