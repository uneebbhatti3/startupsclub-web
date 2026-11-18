"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

import { isNavItemActive } from "@/config/navigation";
import type { AppNavItem } from "@/config/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Secondary links at the bottom of the app sidebar (Settings), with the current page highlighted.
 *
 * @packageDocumentation
 */

type NavSecondaryProps = {
  items: readonly AppNavItem[];
} & ComponentPropsWithoutRef<typeof SidebarGroup>;

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isNavItemActive(pathname, item.href)}
                render={<Link href={item.href} />}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
