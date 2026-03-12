import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';

export const useOnline = () => {
  const { isOnline } = useAppStore();

  useEffect(() => {
    const handleOnline = () => useAppStore.setState({ isOnline: true });
    const handleOffline = () => useAppStore.setState({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export const useUser = () => {
  const { user, token } = useAppStore();
  return { user, token };
};

export const useSessions = () => {
  const { sessions } = useAppStore();
  return sessions;
};
