import { Check } from "lucide-react";

import { Reveal } from "@/features/marketing/components/animations/reveal";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { aiQuotaFootnote } from "@/features/marketing/lib/content/features";
import { plans, showWaitlist } from "@/features/marketing/lib/content/home";
import { cn } from "@/lib/utils";

/**
 * Pricing teaser: what the Free and Pro plans include. No prices are shown because none are decided.
 * The home page shows it whole; the pricing page reuses only the cards (its own hero holds the
 * h1, and the quota footnote moves under the comparison table there).
 *
 * @packageDocumentation
 */

type PricingTeaserProps = {
  /** Section eyebrow and h2. Off on /pricing, where the page hero has the same words as the h1. */
  showHeading?: boolean;
  /** The AI quota footnote under the cards. */
  showFootnote?: boolean;
  /** A "Compare all features" link to the comparison table. */
  compareLink?: boolean;
};

export function PricingTeaser({
  showHeading = true,
  showFootnote = true,
  compareLink = false,
}: PricingTeaserProps) {
  return (
    <section
      id="pricing"
      aria-label={showHeading ? undefined : "Plans"}
      className={cn(
        "scroll-mt-24 border-y bg-muted/60 dark:bg-background",
        !showHeading && "border-t-0",
      )}
    >
      <div className={cn("mx-auto max-w-6xl px-6", showHeading ? "py-24 sm:py-32" : "py-16")}>
        {showHeading ? (
          <Reveal>
            <SectionHeading
              eyebrow="Pricing"
              title="Start free. Upgrade when you want more."
              description="The accountability loop is free. Pro adds AI that works for you personally."
            />
          </Reveal>
        ) : null}

        <Reveal
          stagger
          className={cn("mx-auto grid max-w-4xl gap-5 md:grid-cols-2", showHeading && "mt-14")}
        >
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "mk-plan relative flex flex-col rounded-3xl p-8",
                plan.featured ? "mk-plan-featured" : "border border-border",
              )}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  For serious builders
                </span>
              ) : null}
              <h3 className="font-heading text-3xl font-semibold tracking-tight">{plan.name}</h3>
              <p className="mt-1.5 text-[15px] text-muted-foreground">{plan.tagline}</p>
              {plan.priceNote ? (
                <p className="mt-4 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-text">
                  {plan.priceNote}
                </p>
              ) : null}
              <ul className="mt-6 mb-9 space-y-3 border-t border-border pt-6 text-[15px]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-5 flex-none items-center justify-center rounded-full bg-accent">
                      <Check
                        aria-hidden="true"
                        className="size-3 text-primary-text"
                        strokeWidth={3}
                      />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              {showWaitlist ? (
                <MarketingButton
                  href={plan.cta.href}
                  variant={plan.featured ? "shine" : "arrow-slide"}
                  withArrow={!plan.featured}
                  className="mt-auto w-full"
                >
                  {plan.cta.label}
                </MarketingButton>
              ) : null}
            </article>
          ))}
        </Reveal>

        {showFootnote ? (
          <p className="mx-auto mt-8 max-w-4xl text-center text-sm text-muted-foreground">
            {aiQuotaFootnote}
          </p>
        ) : null}

        {compareLink ? (
          <div className="mt-8 flex justify-center">
            <MarketingButton href="/pricing#compare" variant="ghost-underline">
              Compare all features
            </MarketingButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
