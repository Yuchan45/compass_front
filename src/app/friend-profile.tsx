import { useLocalSearchParams } from 'expo-router';

import { AuthScreen } from '@/screens/auth-screen';
import { FriendProfileScreen } from '@/screens/friend-profile-screen';
import { useAuth } from '@/contexts/auth-context';

export default function FriendProfileRoute() {
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!session) {
    return <AuthScreen />;
  }

  return <FriendProfileScreen friendId={id ?? ''} />;
}
