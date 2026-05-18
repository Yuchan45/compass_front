import { request } from '@/services/api/client';
import type { Friendship } from '@/types/friendships';

export function getReceivedPendingFriendshipsRequest(accessToken: string) {
  return request<Friendship[]>('/friendships?type=received&status=PENDING', {
    accessToken,
  });
}

export function acceptFriendshipRequest(accessToken: string, friendshipId: string) {
  return request<Friendship>(`/friendships/${friendshipId}/accept`, {
    accessToken,
    method: 'POST',
  });
}

export function declineFriendshipRequest(accessToken: string, friendshipId: string) {
  return request<Friendship>(`/friendships/${friendshipId}/decline`, {
    accessToken,
    method: 'POST',
  });
}
