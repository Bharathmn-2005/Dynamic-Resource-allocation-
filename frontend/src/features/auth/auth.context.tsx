import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AuthApi } from '../../api/auth.api';
import { refreshAccessToken } from '../../api/client';
import {
  clearTokens,
  getAccessToken,
  getAuthUser,
  getRefreshToken,
  isTokenExpired,
  onTokenStoreChange,
  setTokens,
} from '../../utils/token';
import type { JwtPayload, ProfileResponse, RegisterRequest, Role } from '../../types/auth';

export interface AuthUser {
  id?: number;
  username?: string;
  email: string;
  role: Role;
}

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

function deriveAuthUser(): AuthUser | null {
  const u = getAuthUser();
  if (!u || !u.email || !u.role) return null;
  return {
    id: u.id,
    email: u.email,
    username: u.email.split('@')[0],
    role: normalizeRole(u.role),
  };
}

function profileToUser(profile: ProfileResponse): AuthUser {
  const current = deriveAuthUser();
  return {
    id: current?.id,
    username: profile.username,
    email: profile.email,
    role: normalizeRole(profile.role),
  };
}

function normalizeRole(role: unknown): Role {
  const r = String(role ?? '').toUpperCase();
  if (r.endsWith('ADMIN')) return 'ADMIN';
  if (r.endsWith('USER')) return 'USER';
  return 'USER';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => deriveAuthUser());
  const [accessToken, setAccessTokenState] = useState<string | null>(
    () => getAccessToken(),
  );
  const [isLoading, setLoading] = useState(true);

  const hydrateProfile = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const profile = await AuthApi.getProfile();
      const nextUser = profileToUser(profile);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      console.error('[Auth] Failed to load profile', error);
      const fallback = deriveAuthUser();
      setUser(fallback);
      return fallback;
    }
  }, []);

  const persistLogin = useCallback((access: string, refresh: string) => {
    setTokens(access, refresh);
    setAccessTokenState(access);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      setLoading(true);
      try {
        const data = await AuthApi.login({ email, password });
        persistLogin(data.accessToken, data.refreshToken);
        const hydratedUser = await hydrateProfile();
        if (hydratedUser) {
          return hydratedUser;
        }
        const fallback = deriveAuthUser();
        if (!fallback) {
          throw new Error('Login succeeded but no user data was found in the token.');
        }
        setUser(fallback);
        return fallback;
      } finally {
        setLoading(false);
      }
    },
    [hydrateProfile, persistLogin],
  );

  const register = useCallback(
    async (payload: RegisterRequest): Promise<void> => {
      setLoading(true);
      try {
        await AuthApi.register(payload);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const refresh = useCallback(async (): Promise<boolean> => {
    const token = await refreshAccessToken();
    if (token) {
      setAccessTokenState(token);
      await hydrateProfile();
      return true;
    }
    clearTokens();
    setAccessTokenState(null);
    setUser(null);
    return false;
  }, [hydrateProfile]);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const refresh = getRefreshToken();
      await AuthApi.logout(refresh ?? undefined).catch(() => undefined);
    } finally {
      clearTokens();
      setAccessTokenState(null);
      setUser(null);
      setLoading(false);
    }
  }, []);
  const refreshProfile = useCallback(async (): Promise<void> => {
    await hydrateProfile();
  }, [hydrateProfile]);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const access = getAccessToken();
      const refresh = getRefreshToken();

      if (!access && !refresh) {
        setAccessTokenState(null);
        setUser(null);
        return;
      }

      if (access) {
        setAccessTokenState(access);
        if (!isTokenExpired(access)) {
          await hydrateProfile();
          return;
        }
      }

      if (refresh) {
        const token = await refreshAccessToken();
        if (token) {
          setAccessTokenState(token);
          await hydrateProfile();
          return;
        }
      }

      clearTokens();
      setAccessTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [hydrateProfile]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    return onTokenStoreChange(() => {
      const access = getAccessToken();
      setAccessTokenState(access);
      if (!access) {
        setUser(null);
        return;
      }

      setUser((current) => current ?? deriveAuthUser());
    });
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const exp = getExp(accessToken);
    if (exp === null) return;
    const ms = Math.max(0, exp * 1000 - Date.now() - 30_000);
    const id = window.setTimeout(() => {
      refresh().catch(() => undefined);
    }, ms);
    return () => window.clearTimeout(id);
  }, [accessToken, refresh]);

  const isAuthenticated = useMemo(
    () => !!accessToken && !isTokenExpired(accessToken),
    [accessToken],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refresh,
      refreshProfile,
    }),
    [user, accessToken, isAuthenticated, isLoading, login, register, logout, refresh, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getExp(token: string): number | null {
  const payload = decodeJwt(token);
  return typeof payload?.exp === 'number' ? payload.exp : null;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const binary = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const json = decodeURIComponent(
      binary.split('').map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
