import { Check, Flame } from "lucide-react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { HeroVideo } from "@/features/marketing/components/hero-video";
import { hero, showWaitlist, waitlistLink } from "@/features/marketing/lib/content/home";

/**
 * Home page hero: headline, supporting sentence, two calls to action and the product video.
 * The heading and text are plain server-rendered HTML; animation only enhances them.
 *
 * @packageDocumentation
 */

export function Hero() {
  return (
    <section className="relative -mt-[68px] overflow-hidden pt-[68px]">
      <div aria-hidden="true" className="mk-wash absolute inset-0" />
      <div aria-hidden="true" className="mk-dots absolute inset-x-0 top-0 h-[640px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 text-center sm:pt-24">
        <Reveal stagger distance={20}>
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            {hero.eyebrow}
          </p>
          <h1 className="mx-auto mt-7 max-w-4xl font-heading text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl md:text-7xl">
            {hero.titleLines[0]}
            <br />
            <span className="text-primary-text">{hero.titleLines[1]}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {hero.description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {showWaitlist ? (
              <MarketingButton href={waitlistLink.href} variant="glow" size="lg" withArrow>
                {waitlistLink.label}
              </MarketingButton>
            ) : null}
            <MarketingButton href="/#how-it-works" variant="gradient-border" size="lg">
              See how it works
            </MarketingButton>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{hero.note}</p>
        </Reveal>

        <Reveal delay={0.25} distance={48} className="relative mx-auto mt-14 max-w-5xl sm:mt-20">
          <div
            aria-hidden="true"
            className="mk-card-shadow absolute bottom-44 -left-16 z-10 hidden items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left xl:flex"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <span>
              <span className="block text-sm font-semibold">Standup posted</span>
              <span className="block text-xs text-muted-foreground">3 of 5 done today</span>
            </span>
          </div>
          <div
            aria-hidden="true"
            className="mk-card-shadow absolute top-24 -right-14 z-10 hidden items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left xl:flex"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent text-primary-text">
              <Flame className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">12-day streak</span>
              <span className="block text-xs text-muted-foreground">Your longest this season</span>
            </span>
          </div>
          <HeroVideo />
        </Reveal>
      </div>
    </section>
  );
}
