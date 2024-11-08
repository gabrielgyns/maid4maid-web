import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { NavLink } from 'react-router-dom';
import { LucideProps } from 'lucide-react';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

type AppSidebarContentProps = {
  items: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
  }[];
};

export function AppSidebarContent({ items }: AppSidebarContentProps) {
  return (
    <SidebarContent className="px-2">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink to={item.url}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
