import { Command } from 'lucide-react';

import { useOrganizationStore } from '@/stores/organization.store';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

export function AppSidebarHeader() {
  const organization = useOrganizationStore((state) => state.organization);

  return (
    <SidebarHeader className="flex-row">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="hover:bg-transparent active:bg-transparent"
            asChild
          >
            <div>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {organization?.logoUrl ? (
                  <img
                    src={organization.logoUrl}
                    alt={organization.name}
                    className="size-full rounded-md object-cover"
                  />
                ) : (
                  <Command className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Maid4Maid</span>
                <span className="truncate text-xs">
                  {organization?.name || 'Cleaning Management'}
                </span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
