const BASE_URL = 'https://api-live-kr.kollus.com/api/v1/live/service-accounts';
const SERVICE_ACCOUNT_KEY = process.env.KOLLUS_SERVICE_ACCOUNT_KEY!;
const BEARER_TOKEN = process.env.KOLLUS_BEARER_TOKEN!;

export const liveServerService = {
  async getBroadcastInfo(broadcast_key: string) {
    const url = `${BASE_URL}/${SERVICE_ACCOUNT_KEY}/broadcasts/${broadcast_key}`;

    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const json = await res.json();
    return json.data;
  },
};