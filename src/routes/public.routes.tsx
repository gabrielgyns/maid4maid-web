import { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { useAuth } from '@/contexts/auth-context';

const Login = lazy(() => import('@/pages/login'));
const Register = lazy(() => import('@/pages/register'));
const ForgotPasswordPage = lazy(() => import('@/pages/forgot-password'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));
const CreatePasswordPage = lazy(() => import('@/pages/create-password'));

const LoadingFallback = () => <div>Loading...</div>;

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Login />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Register />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ForgotPasswordPage />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ResetPasswordPage />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'create-password',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingFallback />}>
              <CreatePasswordPage />
            </Suspense>
          </PublicRoute>
        ),
      },
    ],
  },
];
