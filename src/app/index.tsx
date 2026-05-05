import { AuthScreen } from '@/screens/auth-screen';
import { HomeScreen } from '@/screens/home-screen';
import { useAuth } from '@/contexts/auth-context';

export default function AppEntry() {
  const { session } = useAuth();

  return session ? <HomeScreen /> : <AuthScreen />;
}
