import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SiteFooter } from "@/features/marketing/components/site-footer";
import { SiteHeader } from "@/features/marketing/components/site-header";
import { SmoothScrollProvider } from "@/features/marketing/components/smooth-scroll-provider";
import { buildSiteJsonLd, serializeJsonLd } from "@/lib/seo";

import "@/features/marketing/components/marketing.css";
import Link from "next/link";

/**
 * Layout for the public marketing site: header, footer, smooth scrolling and the marketing-only
 * styles, plus the site-wide Organization and WebSite JSON-LD. Nothing here is loaded by the app
 * or auth route groups.
 *
 * @packageDocumentation
 */

/**
 * Grifter (owner's choice, 13 Nov 2026) for marketing headings only. Exposed as
 * `--font-heading-family`, which the `font-heading` token reads (globals.css), so loading it here
 * keeps it out of the app area. Only the bold cut exists, so it serves every heading weight.
 */
const grifter = localFont({
  src: "../fonts/grifterbold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-heading-family",
});

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <SmoothScrollProvider>
      {/* display: contents adds no box, so the sticky header and layout are unchanged. */}
      <div className={`${grifter.variable} contents`}>
        <Link
          href="#main"
          className="sr-only z-60 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </Link>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </div>
      {/* Approved exception D9: typed server data, `<` escaped by serializeJsonLd. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildSiteJsonLd()) }}
      />
    </SmoothScrollProvider>
  );
}
