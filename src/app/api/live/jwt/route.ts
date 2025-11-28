import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.KOLLUS_SECRET_KEY!;

export async function GET(req: NextRequest) {
  const channel_key = req.nextUrl.searchParams.get("channel_key");
  const client_user_id = req.nextUrl.searchParams.get("client_user_id");

  if (!channel_key || !client_user_id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    live_media_channel_key: channel_key,
    client_user_id,
    expire_time: nowSec + 24 * 60 * 60, // 24시간
    play_expt: nowSec + 24 * 60 * 60, // 24시간
    nochat: true,
  };

  const token = jwt.sign(payload, SECRET_KEY, { algorithm: "HS256" });
  return NextResponse.json({ token });
}
