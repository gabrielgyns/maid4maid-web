import { api } from './api.service';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<AuthResponse>('/sessions', {
      login: credentials.username,
      password: credentials.password,
    });

    return data;
  },

  // TODO: To be implemented
  // today Im creating the user manually or through Organization Registration
  // where it requires a MASTER user to create the organization
  async register(userData: RegisterData) {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);

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
