import { createBrowserRouter, Outlet } from 'react-router-dom';

import { AuthProvider } from '@/contexts/auth-context';
import Error from '@/pages/error';

import { protectedRoutes } from './protected.routes';
import { publicRoutes } from './public.routes';

/**
 * The RootLayout component is responsible for wrapping the entire
 * application with the AuthProvider context.
 * I'm doing this to use redirects inside the AuthProvider context.
 * Looks too much work for a simple redirect, but it's the best way now.
 */

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
      {
        path: '*',
        element: <Error />,
      },
    ],
  },
]);
