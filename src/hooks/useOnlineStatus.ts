import { useEffect, useState } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  lastOnlineAt: number | null;
  lastOfflineAt: number | null;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastOnlineAt, setLastOnlineAt] = useState<number | null>(
    typeof navigator !== 'undefined' && navigator.onLine ? Date.now() : null
  );
  const [lastOfflineAt, setLastOfflineAt] = useState<number | null>(
    typeof navigator !== 'undefined' && !navigator.onLine ? Date.now() : null
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOfflineAt(Date.now());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastOnlineAt, lastOfflineAt };
}
