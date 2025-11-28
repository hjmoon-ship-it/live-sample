import { NextRequest, NextResponse } from "next/server";

const BASE_URL = 'https://api-live-kr.kollus.com/api/v1/live/service-accounts';
const SERVICE_ACCOUNT_KEY = process.env.KOLLUS_SERVICE_ACCOUNT_KEY!;
const BEARER_TOKEN = process.env.KOLLUS_BEARER_TOKEN!;

export async function GET(req: NextRequest) {
  const broadcast_key = req.nextUrl.searchParams.get('broadcast_key');
  const start_date = req.nextUrl.searchParams.get('start_date');
  const end_date = req.nextUrl.searchParams.get('end_date');

  if (!broadcast_key || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const url = `${BASE_URL}/${SERVICE_ACCOUNT_KEY}/broadcasts/${broadcast_key}/statistics/summary?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json.data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
