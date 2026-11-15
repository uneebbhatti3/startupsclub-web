import { getMarketingRoute } from "@/config/site";
import { PageHero } from "@/features/marketing/components/page-hero";
import { WaitlistCount } from "@/features/waitlist/components/waitlist-count";
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form";
import { waitlistPage } from "@/features/waitlist/lib/waitlist-content";
import { createPageMetadata } from "@/lib/seo";

/**
 * Waitlist page (/waitlist): the one call to action while StartupsClub is pre-launch. Every
 * "Join waitlist" button on the site points here.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getMarketingRoute("/waitlist"));

export default function WaitlistPage() {
  return (
    <>
      <PageHero
        eyebrow={waitlistPage.eyebrow}
        title={waitlistPage.title}
        description={waitlistPage.description}
      />
      <section aria-label="Waitlist form" className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
        <WaitlistCount />
        <WaitlistForm />
      </section>
    </>
  );
}
