export function getClientUserId() {
  let id = sessionStorage.getItem('client_user_id');
  if (!id) {
    id = Math.random().toString(36).substring(2, 12); // 10자리 랜덤
    sessionStorage.setItem('client_user_id', id);
  }
  return id;
}