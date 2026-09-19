export type Role = 'ADMIN' | 'USER';

export interface RegisterRequest {
  userName: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string; // ISO date string (yyyy-MM-dd)
  city: string;
  state: string;
  address: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  role: Role;
  registeredAt: string; // ISO datetime
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface MessageResponse {
  message: string;
}

export interface ProfileResponse {
  username: string;
  email: string;
  role: Role;
  phoneNumber?: string;
}

export interface UpdateProfileRequest {
  username: string;
  city: string;
  country: string;
  state: string;
  address: string;
  phoneNumber: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/** Decoded JWT claims produced by the auth service. */
export interface JwtPayload {
  id?: number;
  email?: string;
  role?: Role;
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}
