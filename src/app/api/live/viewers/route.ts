// app/api/live/viewers/route.ts
import { NextRequest, NextResponse } from 'next/server';

const KOLLUS_API_BASE = 'https://api-live-kr.kollus.com/api/v1/live/service-accounts';
const SERVICE_ACCOUNT_KEY = process.env.KOLLUS_SERVICE_ACCOUNT_KEY!;
const BEARER_TOKEN = process.env.KOLLUS_BEARER_TOKEN!;

export async function GET(request: NextRequest) {
  const broadcastKey = request.nextUrl.searchParams.get('broadcast_key');
  const startDate = request.nextUrl.searchParams.get('start_date');
  const endDate = request.nextUrl.searchParams.get('end_date');

  if (!broadcastKey || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  // https://api-live-kr.kollus.com/api/v1/live/service-accounts/{service_account_key}/broadcasts/{broadcast_key}/statistics/summary
  try {

    const res = await fetch(
      `${KOLLUS_API_BASE}/${SERVICE_ACCOUNT_KEY}/broadcasts/${broadcastKey}/statistics/summary?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json.data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
