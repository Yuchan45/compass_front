import { AuthScreen } from '@/screens/auth-screen';
import { FriendsScreen } from '@/screens/friends-screen';
import { useAuth } from '@/contexts/auth-context';

export default function FriendsRoute() {
  const { session } = useAuth();

  return session ? <FriendsScreen /> : <AuthScreen />;
}
