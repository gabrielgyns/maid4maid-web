import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import AppLayout from '@/components/layouts/app-layout';
import { useAuth } from '@/contexts/AuthContext';
import Clients from '@/pages/Clients';
import { ClientForm } from '@/pages/Clients/ClientForm';
import Dashboard from '@/pages/Dashboard';
import { RouteMetadata } from '@/schemas/route.types';
import { useOrganizationStore } from '@/stores/organization.store';
import { useUserStore } from '@/stores/user.store';
// import { Jobs } from "@/pages/jobs";
// import { Teams } from "@/pages/teams";
// import { Profile } from "@/pages/profile";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { fetchProfile } = useUserStore();
  const { fetchOrganization } = useOrganizationStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Using void coz: @typescript-eslint/no-floating-promises
      // I don't see any problem with this right now.
      void fetchProfile();
      void fetchOrganization();
    }
  }, [fetchOrganization, fetchProfile, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Loader Component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const protectedRoutes = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
            handle: {
              title: 'Dashboard',
              breadcrumbs: [{ label: 'Dashboard' }],
            } as RouteMetadata,
          },
          {
            path: 'clients',
            children: [
              {
                path: '',
                element: <Clients />,
                handle: {
                  title: 'Clients',
                  breadcrumbs: [
                    { label: 'Dashboard', path: '/' },
                    { label: 'Clients' },
                  ],
                } as RouteMetadata,
              },
              {
                path: 'new',
                element: <ClientForm />,
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
                element: <ClientForm />,
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
          },
          // {
          // 	path: "jobs",
          // 	element: <Jobs />,
          // },
          // {
          // 	path: "teams",
          // 	element: <Teams />,
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
