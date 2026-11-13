import { CalendarRange, Flame, Trophy, type LucideIcon } from "lucide-react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { SeasonGridMock } from "@/features/marketing/components/product-mockups";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { showWaitlist, waitlistLink } from "@/features/marketing/lib/content/home";

/**
 * Seasons section: explains six-week seasons, streaks and the club leaderboard beside a season grid.
 *
 * @packageDocumentation
 */

const points: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CalendarRange,
    title: "Six weeks, then a fresh start",
    description: "Clubs form in the first three days and stay fixed until the season ends.",
  },
  {
    icon: Flame,
    title: "Streaks you can see",
    description:
      "Every check-in fills a square. Missed days stay visible, so the pattern is honest.",
  },
  {
    icon: Trophy,
    title: "A leaderboard for clubs",
    description:
      "Clubs are ranked on how consistently their members show up, not on how many they are.",
  },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function Seasons() {
  return (
    <section id="seasons" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Clubs and seasons"
            title="Small clubs. Six-week seasons. A reason to come back tomorrow."
          />
          <ul className="mt-9 space-y-6">
            {points.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-accent text-primary-text">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-heading font-semibold tracking-tight">{title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {showWaitlist ? (
            <MarketingButton href={waitlistLink.href} variant="arrow-slide" className="mt-10">
              {waitlistLink.label}
            </MarketingButton>
          ) : null}
        </Reveal>

        <Reveal delay={0.1} className="rounded-3xl border border-border bg-muted/50 p-5 sm:p-8">
          <div className="mk-card-shadow rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold tracking-tight">Your season</p>
              <p className="text-xs font-medium text-muted-foreground">Week 6 of 6</p>
            </div>
            <div aria-hidden="true" className="mt-5 flex gap-2 sm:gap-3">
              <div className="flex flex-col justify-around text-[10px] font-semibold text-muted-foreground">
                {days.map((day, index) => (
                  <span key={index}>{day}</span>
                ))}
              </div>
              <SeasonGridMock className="flex-1" />
            </div>
            <div
              aria-hidden="true"
              className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"
            >
              Missed
              <span className="size-3 rounded-[3px] bg-muted" />
              <span className="size-3 rounded-[3px] bg-primary opacity-30" />
              <span className="size-3 rounded-[3px] bg-primary opacity-50" />
              <span className="size-3 rounded-[3px] bg-primary opacity-75" />
              <span className="size-3 rounded-[3px] bg-primary" />
              All done
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
