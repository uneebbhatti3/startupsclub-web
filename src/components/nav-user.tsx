"use client";

import {
  BellIcon,
  CircleUserRoundIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";

import { appUserMenuLinks } from "@/config/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * User menu at the bottom of the app sidebar: the signed-in member's photo, name and email, links
 * to account, billing and notifications, and "Log out". It only displays what it is given; the
 * route that renders the sidebar reads the session and handles sign-out.
 *
 * @packageDocumentation
 */

export type NavUserData = {
  name: string;
  email: string;
  image: string | null;
};

type NavUserProps = {
  user: NavUserData;
  onSignOut: () => void;
  isSigningOut: boolean;
};

/** Up to two initials for the avatar fallback: "Ada Lovelace" → "AL". */
function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return letters || "?";
}

function UserAvatar({ user }: { user: NavUserData }) {
  return (
    <Avatar className="size-8 rounded-lg">
      {user.image ? <AvatarImage src={user.image} alt="" /> : null}
      <AvatarFallback className="rounded-lg">{initials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

export function NavUser({ user, onSignOut, isSigningOut }: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
          >
            <UserAvatar user={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">{user.email}</span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar user={user} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href={appUserMenuLinks.account} />}>
                <CircleUserRoundIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={appUserMenuLinks.billing} />}>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={appUserMenuLinks.notifications} />}>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isSigningOut} onClick={onSignOut}>
              <LogOutIcon />
              {isSigningOut ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
