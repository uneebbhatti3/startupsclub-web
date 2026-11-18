"use client";

import { Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSlice } from "@/features/dashboard/hooks/use-dashboard";
import { formatDays } from "@/features/dashboard/lib/dashboard-content";

/**
 * The member's club at a glance: season week, how many members checked in today, the club score
 * and the club streak, with a link to the club board. Without a club it offers "Find a club".
 * `ClubSnapshotCardSkeleton` is its loading placeholder for `<Suspense>`.
 *
 * @packageDocumentation
 */

type ClubSnapshotCardProps = {
  className?: string;
};

export function ClubSnapshotCard({ className }: ClubSnapshotCardProps) {
  const club = useDashboardSlice((dashboard) => dashboard.club);

  if (!club) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your club</CardTitle>
          <CardDescription>
            You are not in a club this season. Clubs keep each other shipping.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" nativeButton={false} render={<Link href="/clubs" />}>
            <Users />
            Find a club
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription>Your club</CardDescription>
        <CardTitle>{club.name}</CardTitle>
        <CardAction>
          <Badge variant="secondary">
            Week {club.seasonWeek} of {club.seasonWeeks}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={club.membersPostedToday} max={club.memberCount} className="gap-1.5">
          <ProgressLabel className="font-normal">Checked in today</ProgressLabel>
          <ProgressValue>{() => `${club.membersPostedToday} of ${club.memberCount}`}</ProgressValue>
        </Progress>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Club score</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {club.score}
              <span className="text-sm font-normal text-muted-foreground"> / 100</span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Club streak</dt>
            <dd className="text-xl font-semibold tabular-nums">{formatDays(club.clubStreak)}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={`/clubs/${club.id}`} />}
        >
          Open club board
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ClubSnapshotCardSkeleton({ className }: ClubSnapshotCardProps) {
  return (
    <Card className={className} aria-busy="true" aria-label="Loading your club">
      <CardHeader>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-40" />
        <CardAction>
          <Skeleton className="h-5 w-20" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-1.5 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-7 w-32" />
      </CardFooter>
    </Card>
  );
}
