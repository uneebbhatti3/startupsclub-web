"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive } from "@/config/navigation";
import type { AppNavItem } from "@/config/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

/**
 * Main links of the app sidebar. Highlights the current page (and the parent of a child page)
 * from the URL, and lists an item's child links under it.
 *
 * @packageDocumentation
 */

type NavMainProps = {
  items: readonly AppNavItem[];
};

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);
            const firstChild = item.items?.[0];
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive && !item.items}
                  // A parent with children opens its first child; it has no page of its own.
                  render={<Link href={firstChild?.href ?? item.href} />}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.items ? (
                  <SidebarMenuSub>
                    {item.items.map((child) => (
                      <SidebarMenuSubItem key={child.href}>
                        <SidebarMenuSubButton
                          isActive={isNavItemActive(pathname, child.href)}
                          render={<Link href={child.href} />}
                        >
                          <span>{child.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
