"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardSlice } from "@/features/dashboard/hooks/use-dashboard";
import { toDateKey } from "@/features/dashboard/lib/dashboard-content";
import type { ActivityDay } from "@/features/dashboard/types/dashboard-types";

/**
 * Contribution graph of standup activity over the last 6 months: one square per day in week
 * columns (Monday to Sunday), shaded by how many standup items were done. Today's square follows
 * the live ticks on the standup card. Hovering a square shows the date and count; screen readers
 * get a one-line summary instead of every square. `ContributionGraphCardSkeleton` is its loading
 * placeholder for `<Suspense>`.
 *
 * @packageDocumentation
 */

type Cell = {
  key: string;
  date: Date;
  itemsDone: number;
  isFuture: boolean;
};

const weekdayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

const levelClasses = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
] as const;

function level(itemsDone: number): number {
  if (itemsDone <= 0) return 0;
  if (itemsDone === 1) return 1;
  if (itemsDone === 2) return 2;
  if (itemsDone <= 4) return 3;
  return 4;
}

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
});
const monthFormat = new Intl.DateTimeFormat(undefined, { month: "short" });

/** Week columns from the Monday on or before the first day, up to the end of this week. */
function buildWeeks(counts: Map<string, number>, first: Date, today: Date): Cell[][] {
  const start = new Date(first.getFullYear(), first.getMonth(), first.getDate());
  // getDay(): Sunday is 0. Step back to Monday.
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const todayKey = toDateKey(today);
  const weeks: Cell[][] = [];
  const cursor = new Date(start);
  let reachedToday = false;
  while (!reachedToday) {
    const week: Cell[] = [];
    for (let day = 0; day < 7; day += 1) {
      const key = toDateKey(cursor);
      week.push({
        key,
        date: new Date(cursor),
        itemsDone: counts.get(key) ?? 0,
        isFuture: reachedToday,
      });
      if (key === todayKey) {
        reachedToday = true;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

type ActivitySlice = {
  activity: ActivityDay[];
  /** Items done in today's standup, so today's square updates as items are ticked. */
  todayItemsDone: number;
};

/** Narrowest gap, in weeks, between two month labels so they never run into each other. */
const minWeeksBetweenLabels = 3;

/**
 * Columns that start a month and get a label. A month with fewer than three week columns before
 * the next one starts (usually the cut-off first month) gets none, so labels never overlap.
 */
function monthLabelColumns(weeks: Cell[][]): Set<number> {
  const starts: number[] = [];
  weeks.forEach((week, index) => {
    if (week[0]?.date.getMonth() !== weeks[index - 1]?.[0]?.date.getMonth()) {
      starts.push(index);
    }
  });
  return new Set(
    starts.filter((column, position) => {
      const next = starts[position + 1] ?? weeks.length;
      return next - column >= minWeeksBetweenLabels;
    }),
  );
}

export function ContributionGraphCard() {
  const { activity, todayItemsDone } = useDashboardSlice<ActivitySlice>((dashboard) => ({
    activity: dashboard.activity,
    todayItemsDone: dashboard.today?.items.filter((item) => item.done).length ?? 0,
  }));
  const today = new Date();
  const counts = new Map(activity.map((day) => [day.date, day.itemsDone]));
  counts.set(toDateKey(today), todayItemsDone);

  const firstDay = activity[0] ? new Date(`${activity[0].date}T00:00:00`) : today;
  const weeks = buildWeeks(counts, firstDay, today);

  const values = [...counts.values()];
  const activeDays = values.filter((count) => count > 0).length;
  const itemsDone = values.reduce((sum, count) => sum + count, 0);
  const summary = `${activeDays} active days and ${itemsDone} items done in the last 6 months.`;
  const monthLabels = monthLabelColumns(weeks);

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          {activeDays} active days · {itemsDone} items done in the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* One label column plus one flexible column per week, so the squares fill the card. */}
        <div
          role="img"
          aria-label={summary}
          className="grid grid-flow-col grid-rows-[auto_repeat(7,auto)] gap-0.5 sm:gap-1"
          style={{ gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0, 1fr))` }}
        >
          <span aria-hidden="true" />
          {weekdayLabels.map((label, index) => (
            <span
              key={`weekday-${index}`}
              aria-hidden="true"
              className="flex items-center pr-1 text-[10px] leading-none text-muted-foreground"
            >
              {label}
            </span>
          ))}
          {weeks.map((week, index) => {
            const firstOfWeek = week[0];
            const showMonth = monthLabels.has(index);
            return [
              <span
                key={`month-${firstOfWeek?.key ?? index}`}
                aria-hidden="true"
                className="h-4 overflow-visible text-[10px] leading-4 whitespace-nowrap text-muted-foreground"
              >
                {showMonth && firstOfWeek ? monthFormat.format(firstOfWeek.date) : ""}
              </span>,
              ...week.map((cell) =>
                cell.isFuture ? (
                  <span key={cell.key} aria-hidden="true" className="aspect-square" />
                ) : (
                  <span
                    key={cell.key}
                    aria-hidden="true"
                    title={`${cell.itemsDone} ${cell.itemsDone === 1 ? "item" : "items"} done on ${dayFormat.format(cell.date)}`}
                    className={cn(
                      "aspect-square rounded-[2px] sm:rounded-sm",
                      levelClasses[level(cell.itemsDone)],
                    )}
                  />
                ),
              ),
            ];
          })}
        </div>
        <div aria-hidden="true" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Less</span>
          {levelClasses.map((className) => (
            <span key={className} className={cn("size-3 rounded-[3px]", className)} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContributionGraphCardSkeleton() {
  return (
    <Card className="lg:col-span-3" aria-busy="true" aria-label="Loading activity">
      <CardHeader>
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="aspect-[27/8] w-full" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}
