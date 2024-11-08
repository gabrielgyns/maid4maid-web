import axios, { AxiosError } from 'axios';

import { cookieService } from './cookie.service';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = cookieService.getAuthCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      cookieService.clearAuthCookies();
    }

    return Promise.reject(error);
  },
);
