import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import AppLayout from '@/components/layouts/app-layout';
import { useAuth } from '@/contexts/auth-context';
import Clients from '@/pages/Clients';
import ClientsDetails from '@/pages/Clients/client-details';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
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

const clientsRoutes = {
  path: 'clients',
  children: [
    {
      path: '',
      element: <Clients />,
      handle: {
        title: 'Clients',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Clients' }],
      } as RouteMetadata,
    },
    {
      path: 'new',
      element: <ClientsDetails />,
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
      element: <ClientsDetails />,
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
      element: <Users />,
      handle: {
        title: 'Users',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Users' }],
      } as RouteMetadata,
    },
    // {
    //   path: 'new',
    //   element: <ClientsDetails />,
    //   handle: {
    //     title: 'Clients',
    //     breadcrumbs: [
    //       { label: 'Dashboard', path: '/' },
    //       { label: 'Clients', path: '/clients' },
    //       { label: 'New Client' },
    //     ],
    //   } as RouteMetadata,
    // },
    // {
    //   path: 'edit/:id',
    //   element: <ClientsDetails />,
    //   handle: {
    //     title: 'Clients',
    //     breadcrumbs: [
    //       { label: 'Dashboard', path: '/' },
    //       { label: 'Clients', path: '/clients' },
    //       { label: 'Edit Client' },
    //     ],
    //   } as RouteMetadata,
    // },
  ],
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
          clientsRoutes,
          userRoutes,
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
