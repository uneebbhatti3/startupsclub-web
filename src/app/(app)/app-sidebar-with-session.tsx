"use client";

import { LogInIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-session";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

/**
 * Composes the `auth` feature with the shared app sidebar for every page in `(app)` (a shared component may not import a
 * feature, so the route does it, as with onboarding in D37). The user menu shows the signed-in
 * member from the session. While the session loads it shows a placeholder; if the check fails it
 * offers a retry; when signed out it shows "Log in". Logging out clears the cache and goes to
 * `/login`.
 *
 * @packageDocumentation
 */

function SidebarUserFooter() {
  const router = useRouter();
  const session = useSession();
  const signOut = useSignOut({ onSuccess: () => router.replace("/login") });

  if (session.isPending) {
    // Fixed sizes: SidebarMenuSkeleton picks a random width, which breaks hydration.
    return (
      <div className="flex h-12 items-center gap-2 px-2" aria-hidden="true">
        <Skeleton className="size-8 rounded-lg" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (session.isError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={session.isFetching} onClick={() => void session.refetch()}>
            <RotateCwIcon />
            <span>Could not load your account. Retry</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!session.data) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton render={<Link href="/login" />}>
            <LogInIcon />
            <span>Log in</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const { user } = session.data;
  return (
    <NavUser
      user={{ name: user.name, email: user.email, image: user.image }}
      onSignOut={() => signOut.mutate()}
      isSigningOut={signOut.isPending || signOut.isSuccess}
    />
  );
}

export function AppSidebarWithSession() {
  return <AppSidebar variant="inset" footer={<SidebarUserFooter />} />;
}
