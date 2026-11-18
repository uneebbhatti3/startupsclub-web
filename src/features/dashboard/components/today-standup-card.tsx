"use client";

import { History, Play, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AddStandupItemForm } from "@/features/dashboard/components/add-standup-item-form";
import { StartStandupForm } from "@/features/dashboard/components/start-standup-form";
import { useDashboardSlice } from "@/features/dashboard/hooks/use-dashboard";
import { useToggleStandupItem } from "@/features/dashboard/hooks/use-toggle-standup-item";
import { standupLimits } from "@/features/dashboard/lib/dashboard-content";
import type { TodayStandup } from "@/features/dashboard/types/dashboard-types";

/**
 * Today's standup on the dashboard. Before posting: "Start standup" opens an inline form. After
 * posting: the items with checkboxes to tick them done, progress ("2 of 4 done"), a row to add an
 * item (up to five) and any blocker. The header links to the standup history, and both states
 * offer "Plan with Coach", a Pro feature that links to the pricing page until the coach exists.
 * `TodayStandupCardSkeleton` is its loading placeholder for `<Suspense>`.
 *
 * @packageDocumentation
 */

function PlanWithCoachButton() {
  return (
    <Button variant="outline" nativeButton={false} render={<Link href="/pricing" />}>
      <Sparkles className="text-primary-text" />
      Plan with Coach
      <Badge variant="secondary">Pro</Badge>
    </Button>
  );
}

function HistoryButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      render={<Link href="/standup/history" />}
    >
      <History />
      History
    </Button>
  );
}

function StandupItems({ standup }: { standup: TodayStandup }) {
  const toggle = useToggleStandupItem();
  const doneCount = standup.items.filter((item) => item.done).length;
  const total = standup.items.length;

  return (
    <CardContent className="flex flex-col gap-4">
      <Progress value={doneCount} max={total} aria-label="Standup items done" />
      <ul className="flex flex-col gap-1">
        {standup.items.map((item) => {
          const id = `standup-item-${item.id}`;
          return (
            <li key={item.id} className="flex items-start gap-3 rounded-md px-1 py-1.5">
              <Checkbox
                id={id}
                className="mt-0.5"
                checked={item.done}
                onCheckedChange={(checked) =>
                  toggle.mutate({ standupId: standup.id, itemId: item.id, done: checked })
                }
              />
              <label
                htmlFor={id}
                className={
                  item.done
                    ? "text-sm text-muted-foreground line-through"
                    : "text-sm text-foreground"
                }
              >
                {item.text}
              </label>
            </li>
          );
        })}
      </ul>
      {toggle.isError ? (
        <p role="alert" className="text-sm text-destructive">
          Could not save that change. Try again.
        </p>
      ) : null}
      {total < standupLimits.items ? <AddStandupItemForm standupId={standup.id} /> : null}
      {standup.blockers ? (
        <div className="flex items-start gap-2 rounded-md border px-3 py-2 text-sm">
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <p>
            <span className="font-medium">Blocker: </span>
            <span className="text-muted-foreground">{standup.blockers}</span>
          </p>
        </div>
      ) : null}
    </CardContent>
  );
}

type TodayStandupCardProps = {
  className?: string;
};

export function TodayStandupCard({ className }: TodayStandupCardProps) {
  const standup = useDashboardSlice((dashboard) => dashboard.today);
  const [isStarting, setIsStarting] = useState(false);

  const doneCount = standup ? standup.items.filter((item) => item.done).length : 0;
  let description = "You have not posted today. It takes under a minute.";
  if (standup) {
    description = `${doneCount} of ${standup.items.length} done`;
  } else if (isStarting) {
    description = "List what you will get done today.";
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Today&apos;s standup</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <HistoryButton />
        </CardAction>
      </CardHeader>

      {standup ? <StandupItems standup={standup} /> : null}

      {!standup && isStarting ? (
        <CardContent>
          <StartStandupForm onCancel={() => setIsStarting(false)} />
        </CardContent>
      ) : null}

      {!standup && !isStarting ? (
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={() => setIsStarting(true)}>
            <Play />
            Start standup
          </Button>
          <PlanWithCoachButton />
        </CardFooter>
      ) : (
        <CardFooter>
          <PlanWithCoachButton />
        </CardFooter>
      )}
    </Card>
  );
}

export function TodayStandupCardSkeleton({ className }: TodayStandupCardProps) {
  return (
    <Card className={className} aria-busy="true" aria-label="Loading today's standup">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-56" />
        <CardAction>
          <Skeleton className="h-7 w-20" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-40" />
      </CardFooter>
    </Card>
  );
}
