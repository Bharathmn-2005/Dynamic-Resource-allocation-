import { authApi } from './client';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  RefreshTokenResponse,
  ProfileResponse,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  MessageResponse,
} from '../types/auth';

export const AuthApi = {
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return authApi.post('/auth/register', payload).then((res) => res.data);
  },

  async login(payload: { email: string; password: string }): Promise<LoginResponse> {
    return authApi.post('/auth/login', payload).then((res) => res.data);
  },

  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    return authApi.post('/auth/refresh-token', { refreshToken }).then((res) => res.data);
  },

  async logout(refreshToken?: string): Promise<MessageResponse> {
    return authApi
      .post('/auth/logout', refreshToken ? { refreshToken } : {})
      .then((res) => res.data);
  },

  async getProfile(): Promise<ProfileResponse> {
    return authApi.get('/profile/get-profile').then((res) => res.data);
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<ProfileResponse> {
    return authApi.put('/profile/update', payload).then((res) => res.data);
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<MessageResponse> {
    return authApi.post('/auth/forgot-password', payload).then((res) => res.data);
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<MessageResponse> {
    return authApi.post('/auth/reset-password', payload).then((res) => res.data);
  },

    async changePassword(payload: ChangePasswordRequest): Promise<MessageResponse> {
    return authApi.put('/auth/change-password', payload).then((res) => res.data);
  },

  async verifyEmail(token: string): Promise<MessageResponse> {
    return authApi
      .get('/auth/verify-email', { params: { token } })
      .then((res) => res.data);
  },
};
