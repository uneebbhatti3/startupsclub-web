"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

/**
 * The screen after onboarding completes: "Day 1" with a seven-day streak row (today highlighted)
 * and the way into the app. Uses the primary blue and a Lucide line icon instead of the reference
 * screenshot's orange glow (design system: one accent colour, no page animations). The heading
 * takes focus when it appears, because the button that was pressed is gone.
 *
 * @packageDocumentation
 */

const streakDays = [1, 2, 3, 4, 5, 6, 7] as const;

type OnboardingFinishProps = {
  /** Where "Enter StartupsClub" leads. */
  href: string;
};

export function OnboardingFinish({ href }: OnboardingFinishProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary-text">
        <Flame aria-hidden="true" className="size-8" />
      </span>
      <div className="space-y-3">
        <p className="text-3xl font-semibold tracking-tight text-primary-text">Day 1</p>
        <ol aria-label="Your first week" className="flex justify-center gap-1.5">
          {streakDays.map((day) => (
            <li
              key={day}
              aria-current={day === 1 ? "step" : undefined}
              className={
                day === 1
                  ? "flex size-8 items-center justify-center rounded-md border border-primary bg-primary/10 text-primary-text"
                  : "flex size-8 items-center justify-center rounded-md border text-xs text-muted-foreground"
              }
            >
              {day === 1 ? <Flame aria-label="Day 1" className="size-4" /> : day}
            </li>
          ))}
        </ol>
      </div>
      <div className="space-y-2">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
          The streak starts now
        </h1>
        <p className="max-w-md text-muted-foreground">
          Complete a task to make today count. The streak tracks days you ship, not days you plan.
          Post a standup each morning and watch your activity graph fill up.
        </p>
      </div>
      <Button size="lg" className="w-full" nativeButton={false} render={<Link href={href} />}>
        Enter StartupsClub
      </Button>
    </div>
  );
}
