import { ProtectedRoute } from '@/components/protected-route';
import { MapPlaceholderScreen } from '@/screens/map-placeholder-screen';

export default function MapRoute() {
  return (
    <ProtectedRoute>
      <MapPlaceholderScreen />
    </ProtectedRoute>
  );
}
