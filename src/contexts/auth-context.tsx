import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { loginRequest, getMeRequest, registerRequest, updateMeRequest } from '@/services/api/auth';
import { deleteToken, getToken, setToken } from '@/services/storage/token-storage';
import type {
  AuthResponse,
  LoginPayload,
  PublicUser,
  RegisterPayload,
  UpdateProfilePayload,
} from '@/types/auth';

type AuthSession = {
  accessToken: string;
  user: PublicUser;
};

type AuthContextValue = {
  booting: boolean;
  error: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  session: AuthSession | null;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const accessToken = await getToken();

        if (!accessToken) {
          return;
        }

        const user = await getMeRequest(accessToken);

        if (active) {
          setSession({ accessToken, user });
        }
      } catch {
        await deleteToken();
      } finally {
        if (active) {
          setBooting(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function persistAuthResponse(response: AuthResponse) {
    await setToken(response.accessToken);
    setSession({
      accessToken: response.accessToken,
      user: response.user,
    });
  }

  async function runAuthAction(action: () => Promise<AuthResponse>) {
    setLoading(true);
    setError(null);

    try {
      const response = await action();
      await persistAuthResponse(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Unexpected authentication error.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function login(payload: LoginPayload) {
    await runAuthAction(() => loginRequest(payload));
  }

  async function register(payload: RegisterPayload) {
    await runAuthAction(() => registerRequest(payload));
  }

  async function logout() {
    await deleteToken();
    setSession(null);
    setError(null);
  }

  async function refreshMe() {
    if (!session) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await getMeRequest(session.accessToken);
      setSession({ ...session, user });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not refresh profile.');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(payload: UpdateProfilePayload) {
    if (!session) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await updateMeRequest(session.accessToken, payload);
      setSession({ ...session, user });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        booting,
        error,
        loading,
        login,
        logout,
        refreshMe,
        register,
        session,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
