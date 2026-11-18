/**
 * Limits and small formatting helpers for the dashboard.
 *
 * @packageDocumentation
 */

/** Standup limits. TO CONFIRM with the backend (D42); PRD section 7 counts at most 5 to-dos a day. */
export const standupLimits = {
  items: 5,
  itemText: 120,
  blockers: 280,
} as const;

/** "1 day" / "12 days". */
export function formatDays(count: number): string {
  return `${count} ${count === 1 ? "day" : "days"}`;
}

/** Local calendar date as `YYYY-MM-DD`, the key the activity data uses. */
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Today's date in the browser's timezone, for example "Wednesday, 18 November". */
export function formatToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
}

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

/** "5 minutes ago", "2 hours ago", "yesterday". */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const minutes = Math.round((new Date(iso).getTime() - now.getTime()) / 60_000);
  if (Math.abs(minutes) < 60) {
    return relativeTime.format(minutes, "minute");
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return relativeTime.format(hours, "hour");
  }
  return relativeTime.format(Math.round(hours / 24), "day");
}
