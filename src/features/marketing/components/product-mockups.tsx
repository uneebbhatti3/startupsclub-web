import {
  Bell,
  CalendarRange,
  Check,
  Flame,
  GitCommitHorizontal,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  Users,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

/**
 * Illustrative product UI used on the marketing pages (standup card, season grid, club board,
 * dashboard window). Everything here is decorative sample content built with HTML and CSS, not
 * real user data, so each mockup is hidden from assistive technology with `aria-hidden`.
 *
 * @packageDocumentation
 */

type MockProps = {
  className?: string;
};

const standupItems: { text: string; done: boolean }[] = [
  { text: "Finish the onboarding flow", done: true },
  { text: "Fix the email verification bug", done: true },
  { text: "Reply to three beta testers", done: true },
  { text: "Write the pricing page copy", done: false },
  { text: "Record a two-minute demo", done: false },
];

function Checkbox({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-[18px] flex-none items-center justify-center rounded-[5px] border",
        done ? "border-primary bg-primary text-primary-foreground" : "border-foreground/25",
      )}
    >
      {done ? <Check className="size-3" strokeWidth={3.5} /> : null}
    </span>
  );
}

/** Today's standup: a checklist with a progress bar and a blocker line. */
export function StandupMock({ className }: MockProps) {
  const done = standupItems.filter((item) => item.done).length;

  return (
    <div
      aria-hidden="true"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Today
        </span>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {done} of {standupItems.length} done
        </span>
      </div>
      <p className="mt-1.5 font-heading text-lg font-semibold tracking-tight">Daily standup</p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${(done / standupItems.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2.5">
        {standupItems.map((item) => (
          <li key={item.text} className="flex items-center gap-2.5 text-sm">
            <Checkbox done={item.done} />
            <span
              className={cn(
                item.done && "text-muted-foreground line-through decoration-foreground/20",
              )}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline gap-2.5 border-t border-border pt-3.5 text-[13px] text-muted-foreground">
        <span className="text-[10px] font-semibold tracking-widest uppercase opacity-70">
          Blocker
        </span>
        Waiting on domain verification
      </div>
    </div>
  );
}

/** Completion level per day: 0 missed, 1 to 4 share of to-dos done, null still to come. */
const seasonWeeks: (number | null)[][] = [
  [3, 2, 0, 3, 2, 1],
  [2, 3, 2, 4, 3, 0],
  [0, 3, 4, 3, 4, 2],
  [3, 4, 3, 4, 4, 3],
  [4, 3, 4, 4, 3, 4],
  [2, 4, 4, 4, null, null],
];

const levelOpacity: Record<number, string> = {
  1: "opacity-30",
  2: "opacity-50",
  3: "opacity-75",
  4: "opacity-100",
};

/** A six-week season as a grid of days: one column per week, Monday to Saturday, Sunday resting. */
export function SeasonGridMock({ className, compact = false }: MockProps & { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex gap-1.5", compact ? "gap-1" : "sm:gap-2", className)}
    >
      {seasonWeeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className={cn("flex flex-1 flex-col gap-1.5", compact ? "gap-1" : "sm:gap-2")}
        >
          {week.map((level, dayIndex) => {
            const isToday = weekIndex === 5 && dayIndex === 3;
            return (
              <span
                key={dayIndex}
                className={cn(
                  "aspect-square w-full",
                  compact ? "rounded-[4px]" : "rounded-md sm:rounded-lg",
                  level === null && "border border-dashed border-foreground/15",
                  level === 0 && "bg-muted",
                  level !== null && level > 0 && cn("bg-primary", levelOpacity[level]),
                  isToday && "ring-2 ring-primary-text ring-offset-2 ring-offset-card",
                )}
              />
            );
          })}
          <span
            className={cn(
              "aspect-square w-full border border-foreground/15",
              compact ? "rounded-[4px]" : "rounded-md sm:rounded-lg",
            )}
          />
        </div>
      ))}
    </div>
  );
}

const clubMembers: { initials: string; name: string; status: string; done: boolean }[] = [
  { initials: "AK", name: "Ayesha K.", status: "5 of 5 done", done: true },
  { initials: "BR", name: "Bilal R.", status: "3 of 4 done", done: true },
  { initials: "SM", name: "Sara M.", status: "2 of 5 done", done: true },
  { initials: "OT", name: "Omar T.", status: "Not posted yet", done: false },
];

/** Club board: who has checked in today. */
export function ClubBoardMock({ className }: MockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Club board
        </span>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          14 of 18 checked in
        </span>
      </div>
      <ul className="mt-3.5 space-y-3">
        {clubMembers.map((member) => (
          <li key={member.name} className="flex items-center gap-3 text-sm">
            <span className="inline-flex size-8 flex-none items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-primary-text">
              {member.initials}
            </span>
            <span className="font-medium">{member.name}</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  member.done ? "bg-primary" : "bg-foreground/25",
                )}
              />
              {member.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Streak summary with a compact season grid. */
export function StreakMock({ className }: MockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Season 3 · Week 6
        </span>
        <Flame className="size-4 text-primary-text" />
      </div>
      <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        12 <span className="text-sm font-medium text-muted-foreground">days in a row</span>
      </p>
      <SeasonGridMock compact className="mt-4 max-w-[230px]" />
    </div>
  );
}

/** A ship-log suggestion built from commits, waiting for the member to confirm it. */
export function ShipLogMock({ className }: MockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
        Suggested ship log
      </span>
      <p className="mt-2 text-sm font-medium">Shipped email verification and the onboarding flow</p>
      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
        {[
          "fix: resend verification email",
          "feat: onboarding step 3",
          "chore: tidy auth routes",
        ].map((commit) => (
          <li key={commit} className="flex items-center gap-2">
            <GitCommitHorizontal className="size-3.5 flex-none" />
            <span className="truncate font-mono">{commit}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2 text-xs font-semibold">
        <span className="rounded-full bg-primary px-3.5 py-1.5 text-primary-foreground">
          Accept
        </span>
        <span className="rounded-full border border-border px-3.5 py-1.5">Edit</span>
        <span className="px-2 py-1.5 text-muted-foreground">Dismiss</span>
      </div>
    </div>
  );
}

/** Private AI coach feedback under a standup. */
export function CoachMock({ className }: MockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent text-primary-text">
          <Sparkles className="size-3.5" />
        </span>
        <span className="text-sm font-semibold">Standup Coach</span>
        <span className="ml-auto text-[11px] font-medium text-muted-foreground">
          Private to you
        </span>
      </div>
      <ul className="mt-3.5 space-y-2.5 text-sm">
        <li className="rounded-xl bg-muted px-3.5 py-2.5">
          &ldquo;Write the pricing page copy&rdquo; has carried over three days. Split it into a
          first draft today.
        </li>
        <li className="rounded-xl bg-muted px-3.5 py-2.5">
          Domain verification keeps blocking you. Who can unblock it?
        </li>
      </ul>
    </div>
  );
}

/** Post composer with two targets and a scheduled time. */
export function ComposerMock({ className }: MockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-2xl border border-border bg-card p-5", className)}
    >
      <p className="text-sm leading-relaxed">
        Week 6 of the season: shipped onboarding and email verification. Twelve days in a row and
        counting.
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
        <GitCommitHorizontal className="size-3.5" />
        Linked ship log: onboarding flow
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="rounded-full bg-accent px-3 py-1.5 text-primary-text">
          StartupsClub · Now
        </span>
        <span className="rounded-full border border-border px-3 py-1.5">LinkedIn · Fri 9:00</span>
        <span className="ml-auto rounded-full bg-primary px-3.5 py-1.5 font-semibold text-primary-foreground">
          Publish
        </span>
      </div>
    </div>
  );
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ListChecks, label: "Standup", active: false },
  { icon: Users, label: "Clubs", active: false },
  { icon: CalendarRange, label: "Seasons", active: false },
  { icon: GitCommitHorizontal, label: "Ship logs", active: false },
];

/** The hero visual: a product window with the dashboard inside. */
export function DashboardMock({ className }: MockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mk-card-shadow overflow-hidden rounded-2xl border border-border bg-background sm:rounded-3xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="mx-auto hidden rounded-full bg-muted px-10 py-1 text-[11px] text-muted-foreground sm:block">
          startupsclub · dashboard
        </span>
        <Bell className="ml-auto size-4 text-muted-foreground sm:ml-0" />
      </div>

      <div className="grid md:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-border p-4 md:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Logo />
            StartupsClub
          </div>
          <ul className="mt-5 space-y-1 text-[13px]">
            {sidebarItems.map(({ icon: Icon, label, active }) => (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                  active ? "bg-accent font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="grid items-start gap-4 bg-muted/50 p-4 text-left sm:p-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-4">
            <StandupMock />
            <ClubBoardMock className="hidden sm:block" />
          </div>
          <div className="grid gap-4">
            <StreakMock />
            <ShipLogMock className="hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
