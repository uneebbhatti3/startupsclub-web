import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { appNavMain, appNavSecondary } from "@/config/navigation";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Logo } from "@/components/shared/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * The app sidebar: logo, the main links and Settings from `config/navigation.ts`, and a footer
 * slot for the user menu. The footer is passed in because it needs the session, which lives in the
 * `auth` feature that shared components may not import.
 *
 * @packageDocumentation
 */

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  footer: ReactNode;
};

export function AppSidebar({ footer, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={appNavMain} />
        <NavSecondary items={appNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{footer}</SidebarFooter>
    </Sidebar>
  );
}
