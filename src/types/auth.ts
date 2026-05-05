export type PublicUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  roleCode: string;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: PublicUser;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  displayName: string;
  email: string;
  languageId?: string;
  password: string;
  username: string;
};

export type UpdateProfilePayload = {
  avatarUrl?: string | null;
  displayName?: string;
};
