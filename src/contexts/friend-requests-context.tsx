import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { getReceivedPendingFriendshipsRequest } from '@/services/api/friendships';

type FriendRequestsContextValue = {
  pendingRequestCount: number;
  refreshPendingRequestCount: () => Promise<void>;
  setPendingRequestCount: (count: number) => void;
};

const FriendRequestsContext = createContext<FriendRequestsContextValue | null>(null);

type FriendRequestsProviderProps = {
  children: ReactNode;
};

export function FriendRequestsProvider({ children }: FriendRequestsProviderProps) {
  const { session } = useAuth();
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const refreshPendingRequestCount = useCallback(async () => {
    if (!session) {
      setPendingRequestCount(0);
      return;
    }

    try {
      const requests = await getReceivedPendingFriendshipsRequest(session.accessToken);
      setPendingRequestCount(requests.length);
    } catch {
      setPendingRequestCount(0);
    }
  }, [session]);

  useEffect(() => {
    void refreshPendingRequestCount();
  }, [refreshPendingRequestCount]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void refreshPendingRequestCount();
      }
    });

    return () => subscription.remove();
  }, [refreshPendingRequestCount]);

  return (
    <FriendRequestsContext.Provider
      value={{
        pendingRequestCount,
        refreshPendingRequestCount,
        setPendingRequestCount,
      }}
    >
      {children}
    </FriendRequestsContext.Provider>
  );
}

export function useFriendRequests() {
  const context = useContext(FriendRequestsContext);

  if (!context) {
    throw new Error('useFriendRequests must be used inside FriendRequestsProvider.');
  }

  return context;
}
