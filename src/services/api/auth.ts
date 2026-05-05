import { request } from '@/services/api/client';
import type {
  AuthResponse,
  LoginPayload,
  PublicUser,
  RegisterPayload,
  UpdateProfilePayload,
} from '@/types/auth';

export function loginRequest(payload: LoginPayload) {
  return request<AuthResponse>('/auth/login', {
    body: payload,
    method: 'POST',
  });
}

export function registerRequest(payload: RegisterPayload) {
  return request<AuthResponse>('/auth/register', {
    body: payload,
    method: 'POST',
  });
}

export function getMeRequest(accessToken: string) {
  return request<PublicUser>('/users/me', {
    accessToken,
  });
}

export function updateMeRequest(accessToken: string, payload: UpdateProfilePayload) {
  return request<PublicUser>('/users/me', {
    accessToken,
    body: payload,
    method: 'PATCH',
  });
}
