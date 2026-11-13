import { getMarketingRoute } from "@/config/site";
import { FeatureGroupNav } from "@/features/marketing/components/feature-group-nav";
import { FeatureGroupSection } from "@/features/marketing/components/feature-group-section";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { PageHero } from "@/features/marketing/components/page-hero";
import { featureGroups } from "@/features/marketing/lib/content/features";
import { createPageMetadata } from "@/lib/seo";

/**
 * Features page (/features): every feature, grouped, with its plan badge. Built from
 * `featureGroups`, the same data as the comparison table on /pricing.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getMarketingRoute("/features"));

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything you need to stay consistent"
        description="Built around one habit, the daily standup, with the tools that make it stick."
        withWaitlist
      />

      <FeatureGroupNav groups={featureGroups} />

      {featureGroups.map((group, index) => (
        <FeatureGroupSection key={group.id} group={group} index={index} />
      ))}

      <div className="mx-auto flex max-w-6xl justify-center px-6 pt-4 pb-8">
        <MarketingButton href="/pricing#compare" variant="arrow-slide" size="lg">
          Compare Free and Pro
        </MarketingButton>
      </div>

      <FinalCta />
    </>
  );
}
