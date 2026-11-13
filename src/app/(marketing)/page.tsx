import { getMarketingRoute } from "@/config/site";
import { Faq } from "@/features/marketing/components/faq";
import { Features } from "@/features/marketing/components/features";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { Hero } from "@/features/marketing/components/hero";
import { HowItWorks } from "@/features/marketing/components/how-it-works";
import { PricingTeaser } from "@/features/marketing/components/pricing-teaser";
import { Principles } from "@/features/marketing/components/principles";
import { Problem } from "@/features/marketing/components/problem";
import { Seasons } from "@/features/marketing/components/seasons";
import { createPageMetadata } from "@/lib/seo";

/**
 * Marketing home page. It only composes sections from the marketing feature; all copy lives in
 * features/marketing/lib/content/home.ts.
 *
 * @packageDocumentation
 */

export const metadata = createPageMetadata(getMarketingRoute("/"));

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Principles />
      <Seasons />
      <PricingTeaser compareLink />
      <Faq />
      <FinalCta />
    </>
  );
}
