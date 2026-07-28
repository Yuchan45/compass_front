import { request } from '@/services/api/client';
import type { AvatarPresetsResponse } from '@/types/avatars';

export function getAvatarPresetsRequest() {
  return request<AvatarPresetsResponse>('/avatars/presets');
}
