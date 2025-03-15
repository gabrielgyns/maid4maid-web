import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useToast } from '@/hooks/use-toast';
import { authService, RegisterData } from '@/services/auth.service';
import { cookieService } from '@/services/cookie.service';
import { useUserStore } from '@/stores/user.store';

interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

interface AuthContextData {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<boolean>;
  resetPassword: (data: {
    password: string;
    passwordConfirmation: string;
    token: string;
  }) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { fetchProfile, clearUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = cookieService.getAuthCookie();
      const refreshToken = cookieService.getRefreshCookie();

      if (token && refreshToken) {
        try {
          await fetchProfile();
        } catch (error) {
          console.error(error);
          cookieService.clearAuthCookies();
          clearUser();
        }
      }

      setIsInitialized(true);
    };

    void initializeAuth();
  }, [fetchProfile, clearUser]);

  const token = cookieService.getAuthCookie();
  const refreshToken = cookieService.getRefreshCookie();
  const isAuthenticated = !!token && !!refreshToken;

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      setIsLoading(true);

      try {
        const { access_token, refresh_token } =
          await authService.login(credentials);

        cookieService.setAuthCookie(access_token);
        cookieService.setRefreshCookie(refresh_token);

        await fetchProfile();

        toast({
          title: 'Login',
          description: t('Login.login_success'),
        });

        navigate('/');
      } catch (error) {
        let errorMessage = t('Login.login_error');

        if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }

        toast({
          title: 'Login',
          variant: 'destructive',
          description: errorMessage, // t('Login.login_error')
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile, navigate, t, toast],
  );

  const logout = useCallback(() => {
    setIsLoading(true);

    try {
      const refreshToken = cookieService.getRefreshCookie();

      if (refreshToken) {
        authService.logout(refreshToken).catch(() => {
          console.error('Failed to logout on server');
        });
      }

      cookieService.clearAuthCookies();
      clearUser();

      toast({
        title: 'Logout',
        description: t('Logint.logout_success'),
      });

      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [clearUser, navigate, t, toast]);

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);

      try {
        const { access_token, refresh_token } =
          await authService.register(data);

        cookieService.setAuthCookie(access_token);
        cookieService.setRefreshCookie(refresh_token);

        await fetchProfile();

        toast({
          title: 'Register',
          description: t('Register.register_success'),
        });

        navigate('/login');
      } catch (error) {
        let errorMessage = t('Register.register_error');

        if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }

        toast({
          title: 'Register',
          variant: 'destructive',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile, navigate, t, toast],
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      setIsLoading(true);

      try {
        await authService.requestPasswordReset(email);

        toast({
          title: 'Forgot Password',
          description:
            'If the email is valid, you will receive a link to reset your password!', // t('ForgotPassword.forgot_password_success')
        });

        navigate('/login');
      } catch (error) {
        console.error(error);

        toast({
          title: 'Forgot Password',
          variant: 'destructive',
          description: 'Something went wrong!', // t('ForgotPassword.forgot_password_error')
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  const validateResetToken = useCallback(
    async (token: string) => {
      setIsLoading(true);

      try {
        await authService.validateResetToken(token);

        return true;
      } catch (error) {
        console.error(error);

        toast({
          title: 'Reset Password',
          variant: 'destructive',
          description: 'Invalid or expired reset token',
        });

        navigate('/login');

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  const resetPassword = useCallback(
    async (data: {
      password: string;
      passwordConfirmation: string;
      token: string;
    }) => {
      setIsLoading(true);

      try {
        const { password, passwordConfirmation, token } = data;

        await authService.resetPassword(token, password, passwordConfirmation);

        toast({
          title: 'Reset Password',
          description: 'Your password has been reset successfully!',
        });

        navigate('/login');
      } catch (error) {
        let errorMessage = 'Failed to reset password';

        if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }

        toast({
          title: 'Reset Password',
          variant: 'destructive',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        forgotPassword,
        validateResetToken,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
