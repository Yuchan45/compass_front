import { useRouter } from 'expo-router';

import { ProtectedRoute } from '@/components/protected-route';
import { ProfileFriendsScreen } from '@/screens/profile-friends-screen';

export default function ProfileFriendsRoute() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <ProfileFriendsScreen onBackPress={() => router.replace('/profile')} />
    </ProtectedRoute>
  );
}
