import { Magnetic } from "@/features/marketing/components/animations/magnetic";
import { Reveal } from "@/features/marketing/components/animations/reveal";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { finalCta, showWaitlist, waitlistLink } from "@/features/marketing/lib/content/home";

/**
 * Closing call to action: a soft blue panel with one headline and the magnetic sign-up button.
 *
 * @packageDocumentation
 */

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-border">
        <div aria-hidden="true" className="mk-wash absolute inset-0" />
        <div aria-hidden="true" className="mk-dots absolute inset-0" />
        <div className="relative px-6 py-20 text-center sm:py-28">
          <h2 className="mx-auto max-w-2xl font-heading text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {finalCta.description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
            {showWaitlist ? (
              <Magnetic>
                <MarketingButton href={waitlistLink.href} variant="shine" size="lg" withArrow>
                  {waitlistLink.label}
                </MarketingButton>
              </Magnetic>
            ) : null}
            <MarketingButton href="/#features" variant="ghost-underline">
              Explore the features
            </MarketingButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
