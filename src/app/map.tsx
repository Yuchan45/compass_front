import { AuthScreen } from '@/screens/auth-screen';
import { MapPlaceholderScreen } from '@/screens/map-placeholder-screen';
import { useAuth } from '@/contexts/auth-context';

export default function MapRoute() {
  const { session } = useAuth();

  return session ? <MapPlaceholderScreen /> : <AuthScreen />;
}
