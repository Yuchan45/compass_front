import { ProtectedRoute } from '@/components/protected-route';
import { MeetupsPlaceholderScreen } from '@/screens/meetups-placeholder-screen';

export default function MeetupsRoute() {
  return (
    <ProtectedRoute>
      <MeetupsPlaceholderScreen />
    </ProtectedRoute>
  );
}
