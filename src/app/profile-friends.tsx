import { useRouter } from 'expo-router';

import { AuthScreen } from '@/screens/auth-screen';
import { ProfileFriendsScreen } from '@/screens/profile-friends-screen';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileFriendsRoute() {
  const { session } = useAuth();
  const router = useRouter();

  return session ? (
    <ProfileFriendsScreen onBackPress={() => router.replace('/profile')} />
  ) : (
    <AuthScreen />
  );
}
