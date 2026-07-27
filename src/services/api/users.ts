import { request } from '@/services/api/client';
import type { SearchUsersResponse } from '@/types/users';

export const MIN_USER_SEARCH_LENGTH = 2;
export const USER_SEARCH_LIMIT = 20;

export function searchUsersRequest(accessToken: string, query: string) {
  const params = new URLSearchParams({
    limit: String(USER_SEARCH_LIMIT),
    query,
  });

  return request<SearchUsersResponse>(`/users/search?${params.toString()}`, {
    accessToken,
  });
}
