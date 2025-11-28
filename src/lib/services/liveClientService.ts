export const liveClientService = {
  async getJwt(channel_key: string, client_user_id: string) {
    const res = await fetch(`/api/live/jwt?channel_key=${channel_key}&client_user_id=${client_user_id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to get JWT');
    return json.token;
  },

  async getViewerCountByApi(broadcast_key: string, startDate: string, endDate: string) {
    const res = await fetch(`/api/live/viewers?broadcast_key=${broadcast_key}&start_date=${startDate}&end_date=${endDate}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to get viewer count');
    return json;
  },
};
