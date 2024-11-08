import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '@/services/auth.service';
import { cookieService } from '@/services/cookie.service';
import { useUserStore } from '@/stores/user.store';

interface AuthContextData {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
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

        navigate('/');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setIsLoading(true);

    try {
      // await authService.logout();

      cookieService.clearAuthCookies();

      clearUser();

      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
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
