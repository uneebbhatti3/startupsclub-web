import {
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Settings2,
  Ship,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { SitePath } from "@/config/site";

/**
 * Links in the app sidebar. The owner keeps the sidebar to the main areas; other screens become
 * tabs inside these pages (for example Network and Events inside Forum, D40). Routes follow
 * `docs/APP_FLOW.md` section 2 where it has them; `/coach` is new. Pages that are not built yet
 * 404 until they exist.
 *
 * @packageDocumentation
 */

export type AppNavSubItem = {
  readonly title: string;
  readonly href: SitePath;
};

export type AppNavItem = {
  readonly title: string;
  readonly href: SitePath;
  readonly icon: LucideIcon;
  /** Child links. The parent `href` is used only to mark the parent as active. */
  readonly items?: readonly AppNavSubItem[];
};

export const appNavMain: readonly AppNavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Standups", href: "/standup", icon: ListChecks },
  { title: "Clubs", href: "/clubs", icon: Users },
  { title: "Ship logs", href: "/ship-logs", icon: Ship },
  { title: "Forum", href: "/forum", icon: MessagesSquare },
  { title: "Coach", href: "/coach", icon: Sparkles },
];

export const appNavSecondary: readonly AppNavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings2 },
];

/** Links in the user menu at the bottom of the sidebar. */
export const appUserMenuLinks = {
  account: "/settings",
  billing: "/billing",
  notifications: "/notifications",
} as const satisfies Record<string, SitePath>;

/** Whether `href` is the current page or one of its child pages. */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Name of the sidebar section the current page belongs to, for the header; `null` if none. */
export function appNavTitle(pathname: string): string | null {
  const item = [...appNavMain, ...appNavSecondary].find((entry) =>
    isNavItemActive(pathname, entry.href),
  );
  return item?.title ?? null;
}
