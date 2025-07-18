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

// Calculate token expiration time based on JWT token
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64)) as { exp?: number };

    if (payload.exp) {
      return payload.exp * 1000; // Convert to milliseconds
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
  }

  return null;
};

// Check if token needs refresh (less than 5 minutes to expiration)
const shouldRefreshToken = (token: string): boolean => {
  const expirationTime = getTokenExpirationTime(token);

  if (!expirationTime) return false;

  const fiveMinutes = 5 * 60 * 1000;

  return expirationTime - Date.now() < fiveMinutes;
};

// Proactively refresh token before it expires
const proactiveTokenRefresh = async (token: string): Promise<void> => {
  if (isRefreshing || !shouldRefreshToken(token)) return;

  const refreshToken = cookieService.getRefreshCookie();
  if (!refreshToken) return;

  try {
    isRefreshing = true;

    const { access_token, refresh_token } =
      await authService.refreshToken(refreshToken);

    cookieService.setAuthCookie(access_token);
    cookieService.setRefreshCookie(refresh_token);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      cookieService.clearAuthCookies();
      window.location.href = '/login';
    }
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = cookieService.getAuthCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Avoid loops
      if (!config.url?.includes('/auth/refresh')) {
        void proactiveTokenRefresh(token);
      }
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
    // Handling network errors :)
    if (!error.response) {
      console.error('Network error detected');

      return Promise.reject(
        new Error('Network error. Please check your connection.'),
      );
    }

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    // Handling unauthorized errors (token expired/invalid)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      const refreshToken = cookieService.getRefreshCookie();

      if (!refreshToken) {
        cookieService.clearAuthCookies();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
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

        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError as Error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
