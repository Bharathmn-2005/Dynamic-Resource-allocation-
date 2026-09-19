import { AxiosError } from 'axios';

export class ApiError extends Error {
  public readonly status?: number;
  public readonly data?: unknown;
  public readonly code?: string;

  constructor(
    message: string,
    options?: { status?: number; data?: unknown; code?: string },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.data = options?.data;
    this.code = options?.code;
  }
}

export function createApiError(error: AxiosError): ApiError {
  if (!error.response) {
    return new ApiError('Unable to reach the server. Please check your connection.', {
      code: 'NETWORK_ERROR',
    });
  }

  const status = error.response.status;
  const data = error.response.data;
  const message =
    (typeof data === 'object' &&
      data !== null &&
      ((data as Record<string, unknown>).message ||
        (data as Record<string, unknown>).error ||
        (data as Record<string, unknown>).errorMessage)) ||
    error.message ||
    'Something went wrong. Please try again.';

  return new ApiError(String(message), { status, data, code: `HTTP_${status}` });
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
