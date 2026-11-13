import type { ReactNode } from "react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { showWaitlist, waitlistLink } from "@/features/marketing/lib/content/home";

/**
 * Hero for the inner marketing pages (Features, Pricing, Waitlist): eyebrow, the page's only h1,
 * one supporting sentence and an optional "Join waitlist" action, on the same wash and dotted
 * grid as the home hero. Text is server-rendered; the reveal animation only enhances it.
 *
 * @packageDocumentation
 */

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  /** Shows the primary "Join waitlist" button to /waitlist. */
  withWaitlist?: boolean;
};

export function PageHero({ eyebrow, title, description, withWaitlist = false }: PageHeroProps) {
  return (
    <section className="relative -mt-[68px] overflow-hidden pt-[68px]">
      <div aria-hidden="true" className="mk-wash absolute inset-0" />
      <div aria-hidden="true" className="mk-dots absolute inset-x-0 top-0 h-[520px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 text-center sm:pt-24 sm:pb-20">
        <Reveal stagger distance={20}>
          <p className="text-xs font-semibold tracking-[0.14em] text-primary-text uppercase">
            {eyebrow}
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-heading text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {description}
          </p>
          {withWaitlist && showWaitlist ? (
            <div className="mt-9 flex justify-center">
              <MarketingButton href={waitlistLink.href} variant="glow" size="lg" withArrow>
                {waitlistLink.label}
              </MarketingButton>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
