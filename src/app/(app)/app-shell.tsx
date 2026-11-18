"use client";

import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";

import { AppSidebarWithSession } from "@/app/(app)/app-sidebar-with-session";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireSession } from "@/features/auth/hooks/use-require-session";
import DashboardLayout from "@/layouts/dashboard-layout";

/**
 * The shell and sign-in guard for every page in `(app)` (ARCHITECTURE section 6, "Auth guard").
 * A confirmed signed-out visitor is sent to `/login` by `useRequireSession`. Until the session is
 * confirmed the page shows a placeholder, and if the check fails it shows a retry, so no app data
 * is fetched or shown for a visitor who is not signed in.
 *
 * @packageDocumentation
 */

function SessionPlaceholder() {
  return (
    <div aria-busy="true" aria-label="Loading" className="flex flex-col gap-4 px-4 lg:px-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64" />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const session = useRequireSession();

  let content: ReactNode;
  if (session.isError) {
    content = (
      <div className="flex flex-col items-start gap-3 px-4 lg:px-6">
        <p className="text-sm">We could not check your sign-in. Try again.</p>
        <Button
          variant="outline"
          size="sm"
          disabled={session.isFetching}
          onClick={() => void session.refetch()}
        >
          <RotateCw />
          Retry
        </Button>
      </div>
    );
  } else if (session.data) {
    content = children;
  } else {
    content = <SessionPlaceholder />;
  }

  return <DashboardLayout sidebar={<AppSidebarWithSession />}>{content}</DashboardLayout>;
}
