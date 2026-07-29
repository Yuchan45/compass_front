import { request } from '@/services/api/client';
import type {
  AuthResponse,
  GoogleLoginPayload,
  LoginPayload,
  PublicUser,
  RegisterPayload,
  UpdateProfilePayload,
  UpdateUserSettingsPayload,
} from '@/types/auth';

export function loginRequest(payload: LoginPayload) {
  return request<AuthResponse>('/auth/login', {
    body: payload,
    method: 'POST',
  });
}

export function googleLoginRequest(payload: GoogleLoginPayload) {
  return request<AuthResponse>('/auth/google', {
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

export function updateMeSettingsRequest(accessToken: string, payload: UpdateUserSettingsPayload) {
  return request<PublicUser>('/users/me/settings', {
    accessToken,
    body: payload,
    method: 'PATCH',
  });
}
