// TODO: Maybe in the future this should come from backend
import { Calendar, Contact, Home, Settings, Users } from 'lucide-react';

import { Sidebar } from '@/components/ui/sidebar';

import { AppSidebarContent } from './app-sidebar-content';
import { AppSidebarFooter } from './app-sidebar-footer';
import { AppSidebarHeader } from './app-sidebar-header';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Schedule',
    url: '/schedule',
    icon: Calendar,
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: Contact,
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
  },
  {
    title: 'Teams',
    url: '/teams',
    icon: Users,
  },
  {
    title: 'BookMe (This is a test)',
    url: '/bookme',
    icon: Users,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent items={items} />
      <AppSidebarFooter />
    </Sidebar>
  );
}
