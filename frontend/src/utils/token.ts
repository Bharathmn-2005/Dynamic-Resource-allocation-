import type { JwtPayload } from '../types/auth';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const AUTH_EVENT = 'railvoyage-auth-tokens-changed';

function emitAuthChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  emitAuthChange();
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  emitAuthChange();
}

export function onTokenStoreChange(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(AUTH_EVENT, cb);
  return () => window.removeEventListener(AUTH_EVENT, cb);
}

export const tokenStore = {
  getAccessToken(): string | null {
    return getAccessToken();
  },
  getRefreshToken(): string | null {
    return getRefreshToken();
  },
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_KEY, token);
    emitAuthChange();
  },
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_KEY, token);
    emitAuthChange();
  },
  clear(): void {
    clearTokens();
  },
};

function b64UrlToUtf8(value: string): string {
  let b64 = value.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  try {
    return decodeURIComponent(
      binary
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    } catch {
    return binary;
  }
}

export function decodeAccessToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = b64UrlToUtf8(payload);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAccessTokenExp(token: string | null): number | null {
  if (!token) return null;
  const decoded = decodeAccessToken(token);
  return typeof decoded?.exp === 'number' ? decoded.exp : null;
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const exp = getAccessTokenExp(token);
  if (exp === null) return true;
  // Treat tokens expiring within the next 30s as expired (clock-skew buffer).
  return Date.now() >= exp * 1000 - 30_000;
}

export function getAuthUser() {
  const token = tokenStore.getAccessToken();
  if (!token) return null;
  const decoded = decodeAccessToken(token);
  if (!decoded) return null;
  return {
    id: typeof decoded.id === 'number' ? decoded.id : undefined,
    email: typeof decoded.email === 'string' ? decoded.email : decoded.sub,
    role: decoded.role,
  };
}
