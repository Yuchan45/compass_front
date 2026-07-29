import { ProtectedRoute } from '@/components/protected-route';
import { ProfileScreen } from '@/screens/profile-screen';

export default function ProfileRoute() {
  return (
    <ProtectedRoute>
      <ProfileScreen />
    </ProtectedRoute>
  );
}
