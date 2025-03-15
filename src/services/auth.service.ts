import { z } from 'zod';

import { formSchema } from '@/schemas/register.types';

import api from './api.service';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type RegisterData = z.infer<typeof formSchema>;

export const authService = {
  async login({ username, password }: LoginCredentials) {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      login: username,
      password,
    });

    return data;
  },

  async register(userData: RegisterData) {
    const { data } = await api.post<AuthResponse>('/organizations', userData);

    return data;
  },

  async refreshToken(refreshToken: string) {
    const { data } = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    return data;
  },

  async logout(refreshToken: string) {
    return await api.post('/auth/logout', { refreshToken });
  },

  // --- Reset Password ---
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return await api.post('/password-resets/request', { email });
  },

  async validateResetToken(token: string): Promise<{ valid: boolean }> {
    return await api.get(`/password-resets/validate?token=${token}`);
  },

  async resetPassword(
    token: string,
    newPassword: string,
    passwordConfirmation: string,
  ): Promise<{ message: string }> {
    return await api.post('/password-resets/reset', {
      token,
      password: newPassword,
      passwordConfirmation,
    });
  },
};
