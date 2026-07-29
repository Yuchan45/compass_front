import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { booting, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!booting && !session) {
      router.replace('/');
    }
  }, [booting, router, session]);

  if (booting || !session) {
    return <View style={{ flex: 1 }} />;
  }

  return <>{children}</>;
}
