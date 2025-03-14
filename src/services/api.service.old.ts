/**
 * @deprecated
 * @see api.service.ts
 * @description This is the old API service WITHOUT GRACEFUL REFRESH that is no longer used.
 * @description It is kept here for reference.
 * @description It is not used in the new codebase.
 * @description It is not used in the new codebase.
 * @description It is not used in the new codebase.
 * @description It is not used in the new codebase.
 * @description It is not used in the new codebase.
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { authService } from './auth.service';
import { cookieService } from './cookie.service';

const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL as string) || 'http://localhost:3333/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

// Process the queue of failed requests
const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.config.headers = promise.config.headers || {};
      promise.config.headers.Authorization = `Bearer ${token}`;
      promise.resolve(api(promise.config));
    }
  });

  failedQueue = [];
};

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
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      const refreshToken = cookieService.getRefreshCookie();

      if (!refreshToken) {
        cookieService.clearAuthCookies();

        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      try {
        originalRequest._retry = true;
        isRefreshing = true;

        const { access_token, refresh_token } =
          await authService.refreshToken(refreshToken);

        cookieService.setAuthCookie(access_token);
        cookieService.setRefreshCookie(refresh_token);

        // Updating Authorization header for the original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);

        isRefreshing = false;

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        cookieService.clearAuthCookies();

        isRefreshing = false;

        return Promise.reject(refreshError as Error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
