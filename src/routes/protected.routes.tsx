import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import AppLayout from '@/components/layouts/app-layout';
import { useAuth } from '@/contexts/auth-context';
import Schedule from '@/pages/schedule';
import { RouteMetadata } from '@/schemas/route.types';
import { useOrganizationStore } from '@/stores/organization.store';
import { useUserStore } from '@/stores/user.store';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const Clients = lazy(() => import('@/pages/clients'));
const ClientsDetails = lazy(() => import('@/pages/clients/client-details'));
const Users = lazy(() => import('@/pages/users'));
const UserDetails = lazy(() => import('@/pages/users/user-details'));
const Teams = lazy(() => import('@/pages/teams'));

const LoadingFallback = () => <div>Loading...</div>;

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { fetchProfile } = useUserStore();
  const { fetchOrganization } = useOrganizationStore();

  useEffect(() => {
    if (isAuthenticated) {
      void fetchProfile();
      void fetchOrganization();
    }
  }, [fetchOrganization, fetchProfile, isAuthenticated]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const clientsRoutes = {
  path: 'clients',
  children: [
    {
      path: '',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Clients />
        </Suspense>
      ),
      handle: {
        title: 'Clients',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Clients' }],
      } as RouteMetadata,
    },
    {
      path: 'new',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ClientsDetails />
        </Suspense>
      ),
      handle: {
        title: 'Clients',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Clients', path: '/clients' },
          { label: 'New Client' },
        ],
      } as RouteMetadata,
    },
    {
      path: 'edit/:id',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ClientsDetails />
        </Suspense>
      ),
      handle: {
        title: 'Clients',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Clients', path: '/clients' },
          { label: 'Edit Client' },
        ],
      } as RouteMetadata,
    },
  ],
};

const userRoutes = {
  path: 'users',
  children: [
    {
      path: '',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Users />
        </Suspense>
      ),
      handle: {
        title: 'Users',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Users' }],
      } as RouteMetadata,
    },
    {
      path: 'new',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <UserDetails />
        </Suspense>
      ),
      handle: {
        title: 'Users',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Users', path: '/users' },
          { label: 'New User' },
        ],
      } as RouteMetadata,
    },
    {
      path: 'edit/:id',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <UserDetails />
        </Suspense>
      ),
      handle: {
        title: 'Users',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Users', path: '/users' },
          { label: 'Edit User' },
        ],
      } as RouteMetadata,
    },
  ],
};

const teamRoutes = {
  path: 'teams',
  children: [
    {
      path: '',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Teams />
        </Suspense>
      ),
      handle: {
        title: 'Teams',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Teams' }],
      } as RouteMetadata,
    },
  ],
};

const scheduleRoutes = {
  path: 'schedule',
  children: [
    {
      path: '',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Schedule />
        </Suspense>
      ),
      handle: {
        title: 'Schedule',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Schedule' }],
      } as RouteMetadata,
    },
  ],
};

import { RouteObject } from 'react-router-dom';

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            ),
            handle: {
              title: 'Dashboard',
              breadcrumbs: [{ label: 'Dashboard' }],
            } as RouteMetadata,
          },
          clientsRoutes,
          userRoutes,
          teamRoutes,
          scheduleRoutes,
          // {
          // 	path: "jobs",
          // 	element: <Jobs />,
          // },
          // {
          // 	path: "profile",
          // 	element: <Profile />,
          // },
        ],
      },
    ],
  },
];
