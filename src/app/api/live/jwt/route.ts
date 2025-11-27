import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.KOLLUS_SECRET_KEY!;

export async function GET(request: NextRequest) {
  const { channel_key } = Object.fromEntries(request.nextUrl.searchParams.entries());

  if (!channel_key) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // 문서 기준 Payload Spec: client_user_id 필수 등. :contentReference[oaicite:2]{index=2}
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    live_media_channel_key: channel_key,
    client_user_id: "test",
    expire_time: nowSec + 3600, // 1시간
    play_expt: nowSec + 3600 * 2, // 재생 만료시간 (선택)
    nochat: true,
    // video_watermarking_code_policy: {
    //   code_kind: "client_user_id",
    //   font_size: 7,
    //   font_color: "FFFFFF",
    //   show_time: 1,
    //   hide_time: 500,
    //   alpha: 50,
    //   enable_html5_player: false
    // }
  };

  const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });

  return NextResponse.json({
    token
  });
}
