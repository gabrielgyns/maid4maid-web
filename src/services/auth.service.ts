import { z } from 'zod';

import { formSchema } from '@/schemas/register.types';

import { api } from './api.service';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

export type RegisterData = Omit<
  z.infer<typeof formSchema>,
  'userMaster.password_confirmation'
>;

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<AuthResponse>('/sessions', {
      login: credentials.username,
      password: credentials.password,
    });

    return data;
  },

  // Seems weird to have a register through organization endpoint,
  // but since this is a saas (working as multi-tenant), our tenant is the organization,
  // so we start the registration through the organization (the source of truth)
  async register(userData: RegisterData) {
    const { data } = await api.post<AuthResponse>('/organizations', userData);

    return data;
  },

  // >>>>>> TODO: To be implemented <<<<<<
  // async logout() {
  // 	await api.post("/sessions/logout");
  // },

  // async forgotPassword(email: string) {
  // 	return api.post("/auth/forgot-password", { email });
  // },

  // async resetPassword(token: string, newPassword: string) {
  // 	return api.post("/auth/reset-password", {
  // 		token,
  // 		newPassword,
  // 	});
  // },
};
