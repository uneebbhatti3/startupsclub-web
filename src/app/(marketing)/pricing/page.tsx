import { getMarketingRoute } from "@/config/site";
import { Reveal } from "@/features/marketing/components/animations/reveal";
import { ComparisonTable } from "@/features/marketing/components/comparison-table";
import { Faq } from "@/features/marketing/components/faq";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { PageHero } from "@/features/marketing/components/page-hero";
import { PricingTeaser } from "@/features/marketing/components/pricing-teaser";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { aiQuotaFootnote, featureGroups } from "@/features/marketing/lib/content/features";
import { createPageMetadata } from "@/lib/seo";

/**
 * Pricing page (/pricing): the Free and Pro plan cards (reused from the home page), then the
 * full comparison table built from `featureGroups`, the FAQ and the closing call to action.
 * No prices: none are decided.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getMarketingRoute("/pricing"));

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Upgrade when you want more."
        description="The accountability loop is free. Pro adds AI that works for you personally."
      />

      <PricingTeaser showHeading={false} showFootnote={false} />

      <section
        id="compare"
        aria-labelledby="compare-heading"
        className="mx-auto max-w-4xl scroll-mt-24 px-6 py-24 sm:py-28"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Compare"
            title={<span id="compare-heading">Free and Pro, feature by feature</span>}
          />
        </Reveal>

        <div className="mt-12">
          <ComparisonTable groups={featureGroups} />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">{aiQuotaFootnote}</p>
      </section>

      <Faq />
      <FinalCta />
    </>
  );
}
