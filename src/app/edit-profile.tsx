import { ProtectedRoute } from '@/components/protected-route';
import { EditProfileScreen } from '@/screens/edit-profile-screen';

export default function EditProfileRoute() {
  return (
    <ProtectedRoute>
      <EditProfileScreen />
    </ProtectedRoute>
  );
}
