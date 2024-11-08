import { Navigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
// import { ForgotPassword } from "@/pages/auth/forgot-password";
// import { ResetPassword } from "@/pages/auth/reset-password";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const publicRoutes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      // {
      // 	path: "forgot-password",
      // 	element: (
      // 		<PublicRoute>
      // 			<ForgotPassword />
      // 		</PublicRoute>
      // 	),
      // },
      // {
      // 	path: "reset-password",
      // 	element: (
      // 		<PublicRoute>
      // 			<ResetPassword />
      // 		</PublicRoute>
      // 	),
      // },
    ],
  },
];
