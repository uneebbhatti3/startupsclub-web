import { getMarketingRoute } from "@/config/site";
import { PageHero } from "@/features/marketing/components/page-hero";
import { WaitlistCount } from "@/features/waitlist/components/waitlist-count";
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form";
import { waitlistPage } from "@/features/waitlist/lib/waitlist-content";
import { getCachedWaitlistCount } from "@/features/waitlist/services/waitlist-count-cache";
import { createPageMetadata } from "@/lib/seo";

/**
 * Waitlist page (/waitlist): public and listed in the sitemap again (D43); the header's "Join
 * waitlist" button points here. The count is fetched and cached on the server (D35) so it shows
 * on load even while the API is waking up.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getMarketingRoute("/waitlist"));

export default async function WaitlistPage() {
  const initialCount = await getCachedWaitlistCount();

  return (
    <>
      <PageHero
        eyebrow={waitlistPage.eyebrow}
        title={waitlistPage.title}
        description={waitlistPage.description}
      />
      <section aria-label="Waitlist form" className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
        <WaitlistCount initialCount={initialCount} />
        <WaitlistForm />
      </section>
    </>
  );
}
