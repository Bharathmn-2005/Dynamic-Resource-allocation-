import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosResponse,
  type AxiosHeaders,
} from 'axios';
import { env } from '../config/env';
import { tokenStore, isTokenExpired } from '../utils/token';
import { createApiError, ApiError } from './errors';

export type ServiceName = 'auth' | 'booking' | 'payment';

export function resolveServiceBase(service: ServiceName): string {
  if (env.isDev) {
    // In development, same-origin relative URLs are served through Vite's proxy.
    return '';
  }
  switch (service) {
    case 'auth':
      return env.authUrl;
    case 'booking':
      return env.bookingUrl;
    case 'payment':
      return env.paymentUrl;
  }
}

const PUBLIC_PATHS = new Set<string>([
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/logout',
]);

export function isPublicPath(url?: string): boolean {
  if (!url) return false;
  const path = url.split('?')[0];
  // Only the endpoints that genuinely work without a token are public.
  // /auth/change-password requires authentication and must receive the Bearer header.
  return PUBLIC_PATHS.has(path);
}

// Lightweight axios instance used only to perform a token refresh, so it never
// runs the response interceptor (avoids infinite recursion).
const authRawClient = axios.create({
  baseURL: resolveServiceBase('auth'),
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn?: number;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStore.getRefreshToken();
  if (!refresh) return null;
  try {
    const { data } = await authRawClient.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      { refreshToken: refresh },
    );
    if (data?.accessToken) {
      tokenStore.setAccessToken(data.accessToken);
      setTimeout(() => {
        if (isTokenExpired(tokenStore.getAccessToken()) && tokenStore.getRefreshToken()) {
          refreshAccessToken().catch(() => undefined);
        }
      }, Math.max(0, (data.expiresIn ?? 0) - 60) * 1000);
      return data.accessToken;
    }
    return null;
  } catch {
    tokenStore.clear();
    return null;
  }
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null, error: boolean) => void> = [];

function subscribeToken(cb: (token: string | null, error: boolean) => void): void {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null, error: boolean): void {
  const subs = refreshSubscribers;
  refreshSubscribers = [];
  subs.forEach((cb) => cb(token, error));
}

function attachRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const access = tokenStore.getAccessToken();
    if (access && !isPublicPath(config.url)) {
      config.headers.set('Authorization', `Bearer ${access}`);
    }
    return config;
  });
}

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

function attachResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const { config, response } = error;
      if (!response) {
        return Promise.reject(
          new ApiError('Unable to reach the server. Please check your connection.', {
            code: 'NETWORK_ERROR',
          }),
        );
      }

      if (response.status !== 401) {
        return Promise.reject(createApiError(error));
      }

      const originalPath = (config?.url ?? '').split('?')[0];
      if (isPublicPath(originalPath) || (config as RetryableRequestConfig)._retry) {
        return Promise.reject(createApiError(error));
      }

      const retryConfig = config as RetryableRequestConfig;
      return new Promise<AxiosResponse>((resolvePromise, rejectPromise) => {
        subscribeToken((newToken, refreshError) => {
          if (refreshError || !newToken) {
            tokenStore.clear();
            rejectPromise(createApiError(error));
            return;
          }
                              retryConfig._retry = true;
          if (retryConfig.headers) {
            (retryConfig.headers as AxiosHeaders).set('Authorization', `Bearer ${newToken}`);
          }
          resolvePromise(client(retryConfig));
        });

        if (!isRefreshing) {
          isRefreshing = true;
          refreshAccessToken()
            .then((token) => onRefreshed(token, !token))
            .catch(() => onRefreshed(null, true))
            .finally(() => {
              isRefreshing = false;
            });
        }
      });
    },
  );
}

export function createApiClient(service: ServiceName, options: AxiosRequestConfig = {}): AxiosInstance {
  const client = axios.create({
    baseURL: resolveServiceBase(service),
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  attachRequestInterceptor(client);
  attachResponseInterceptor(client);
  return client;
}

export const authApi = createApiClient('auth');
export const bookingApi = createApiClient('booking');
export const paymentApi = createApiClient('payment');
