"use client";

import { Suspense } from "react";

import {
  ClubSnapshotCard,
  ClubSnapshotCardSkeleton,
} from "@/features/dashboard/components/club-snapshot-card";
import {
  ContributionGraphCard,
  ContributionGraphCardSkeleton,
} from "@/features/dashboard/components/contribution-graph-card";
import { DashboardErrorBoundary } from "@/features/dashboard/components/dashboard-error-boundary";
import {
  NotificationsPeekCard,
  NotificationsPeekCardSkeleton,
} from "@/features/dashboard/components/notifications-peek-card";
import { StreakCard, StreakCardSkeleton } from "@/features/dashboard/components/streak-card";
import {
  TodayStandupCard,
  TodayStandupCardSkeleton,
} from "@/features/dashboard/components/today-standup-card";
import { formatToday } from "@/features/dashboard/lib/dashboard-content";

/**
 * The member dashboard (US-D4): a page header with today's date, then today's standup, streak,
 * club snapshot, notifications and the activity graph. Each card sits in its own `<Suspense>`
 * with its own skeleton as the fallback; one error boundary around them shows a message with
 * retry if loading fails. Client-only so the date is the member's, not the build server's.
 *
 * @packageDocumentation
 */

/** Spans the rows beside the right-hand cards, but is only as tall as its content. */
const standupLayout = "lg:col-span-2 lg:row-span-3 lg:self-start";

export function DashboardScreen() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{formatToday()}</p>
      </header>

      <DashboardErrorBoundary>
        <div className="grid gap-4 lg:grid-cols-3">
          <Suspense fallback={<TodayStandupCardSkeleton className={standupLayout} />}>
            <TodayStandupCard className={standupLayout} />
          </Suspense>
          <Suspense fallback={<StreakCardSkeleton />}>
            <StreakCard />
          </Suspense>
          <Suspense fallback={<ClubSnapshotCardSkeleton />}>
            <ClubSnapshotCard />
          </Suspense>
          <Suspense fallback={<NotificationsPeekCardSkeleton />}>
            <NotificationsPeekCard />
          </Suspense>
          <Suspense fallback={<ContributionGraphCardSkeleton />}>
            <ContributionGraphCard />
          </Suspense>
        </div>
      </DashboardErrorBoundary>
    </div>
  );
}
