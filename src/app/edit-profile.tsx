import { AuthScreen } from '@/screens/auth-screen';
import { EditProfileScreen } from '@/screens/edit-profile-screen';
import { useAuth } from '@/contexts/auth-context';

export default function EditProfileRoute() {
  const { session } = useAuth();

  return session ? <EditProfileScreen /> : <AuthScreen />;
}
