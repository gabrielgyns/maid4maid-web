import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
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
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { fetchProfile, clearUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  const token = cookieService.getAuthCookie();

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      setIsLoading(true);

      try {
        const { access_token } = await authService.login(credentials);
        cookieService.setAuthCookie(access_token);

        await fetchProfile();

        toast({
          title: 'Login',
          description: t('Login.login_success'),
        });

        navigate('/');
      } catch {
        toast({
          title: 'Login',
          variant: 'destructive',
          description: t('Login.login_error'),
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
      // await authService.logout();

      cookieService.clearAuthCookies();

      clearUser();

      toast({
        title: 'Logout',
        description: t('Logout.logout_success'),
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
        await authService.register(data);

        toast({
          title: 'Register',
          description: t('Register.register_success'),
        });

        navigate('/login');
      } catch (error: unknown) {
        let errorMessage = t('Register.register_error');

        if (axios.isAxiosError(error) && error.response) {
          // Basically... Type guard for the error response data
          const errorData = error.response.data as ApiErrorResponse;
          errorMessage = errorData.message || errorMessage;
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
    [navigate, t, toast],
  );

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        isLoading,
        isAuthenticated: !!token,
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
