"use client";

import { Flame } from "lucide-react";

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSlice } from "@/features/dashboard/hooks/use-dashboard";
import { formatDays } from "@/features/dashboard/lib/dashboard-content";

/**
 * The member's current standup streak and their best one. `StreakCardSkeleton` is its loading
 * placeholder for `<Suspense>`.
 *
 * @packageDocumentation
 */

export function StreakCard() {
  const streak = useDashboardSlice((dashboard) => dashboard.streak);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Current streak</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {formatDays(streak.current)}
        </CardTitle>
        <CardAction>
          <Flame aria-hidden="true" className="size-5 text-primary-text" />
        </CardAction>
        <p className="text-sm text-muted-foreground">Best: {formatDays(streak.best)}</p>
      </CardHeader>
    </Card>
  );
}

export function StreakCardSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading streak">
      <CardHeader>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-4 w-20" />
      </CardHeader>
    </Card>
  );
}
