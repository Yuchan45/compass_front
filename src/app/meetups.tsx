import { AuthScreen } from '@/screens/auth-screen';
import { MeetupsPlaceholderScreen } from '@/screens/meetups-placeholder-screen';
import { useAuth } from '@/contexts/auth-context';

export default function MeetupsRoute() {
  const { session } = useAuth();

  return session ? <MeetupsPlaceholderScreen /> : <AuthScreen />;
}
