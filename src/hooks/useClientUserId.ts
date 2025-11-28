import { useState, useEffect } from 'react';

export function useClientUserId() {
  const [clientUserId, setClientUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = sessionStorage.getItem('client_user_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 12);
      sessionStorage.setItem('client_user_id', id);
    }
    setClientUserId(id);
  }, []);

  return clientUserId;
}
