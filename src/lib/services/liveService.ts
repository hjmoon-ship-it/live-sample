const PREFIX = process.env.NEXT_PUBLIC_PREFIX ?? "";

export const liveService = {
  async getJwt(channel_key: string) {
    const res = await fetch(
      `${PREFIX}/api/live/jwt?channel_key=${channel_key}&nochat=1&player_version=html5`
    );
    return res.json();
  },

  async getViewerCount(broadcast_key: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${PREFIX}/api/live/viewers?broadcast_key=${broadcast_key}&start_date=${startDate}&end_date=${endDate}`
    );
    return res.json();
  }
};
