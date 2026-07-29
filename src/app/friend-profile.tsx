import { useLocalSearchParams } from 'expo-router';

import { ProtectedRoute } from '@/components/protected-route';
import { FriendProfileScreen } from '@/screens/friend-profile-screen';

export default function FriendProfileRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <ProtectedRoute>
      <FriendProfileScreen friendId={id ?? ''} />
    </ProtectedRoute>
  );
}
