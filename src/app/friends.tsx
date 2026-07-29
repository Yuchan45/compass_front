import { ProtectedRoute } from '@/components/protected-route';
import { FriendsScreen } from '@/screens/friends-screen';

export default function FriendsRoute() {
  return (
    <ProtectedRoute>
      <FriendsScreen />
    </ProtectedRoute>
  );
}
