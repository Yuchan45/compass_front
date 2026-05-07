import { AuthScreen } from '@/screens/auth-screen';
import { ProfileScreen } from '@/screens/profile-screen';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileRoute() {
  const { session } = useAuth();

  return session ? <ProfileScreen /> : <AuthScreen />;
}
