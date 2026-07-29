export type PublicUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  settings: {
    colorTheme: ColorThemeMode;
  };
  roleCode: string;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ColorThemeMode = 'light' | 'dark';

export type AuthResponse = {
  accessToken: string;
  user: PublicUser;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type GoogleLoginPayload = {
  idToken: string;
};

export type RegisterPayload = {
  avatarPresetId: string;
  displayName: string;
  email: string;
  languageId?: string;
  password: string;
  username: string;
};

export type UpdateProfilePayload = {
  avatarUrl?: string | null;
  displayName?: string;
  username?: string;
};

export type UpdateUserSettingsPayload = {
  colorTheme?: ColorThemeMode;
};
