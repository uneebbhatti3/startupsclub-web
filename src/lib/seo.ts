import type { Metadata } from "next";
import { siteConfig, type SitePath } from "@/config/site";

/**
 * SEO helpers: absolute URLs, per-page metadata with a correct canonical URL, and the
 * site-wide Organization and WebSite structured data (JSON-LD).
 *
 * @packageDocumentation
 */

export type PageMetadataInput = {
  title: string;
  description: string;
  path: SitePath;
  /** Use the title as-is instead of applying the site title template. */
  absoluteTitle?: boolean;
};

/**
 * Builds an absolute URL on the configured site origin. The home page is the bare origin with
 * no trailing slash, matching how Next.js renders the canonical link, so canonical, sitemap,
 * JSON-LD and llms.txt all use the identical string.
 */
export function absoluteUrl(path: SitePath): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

/** Shared social image; see `siteConfig.ogImage` for why it is set explicitly. */
export const shareImage = { ...siteConfig.ogImage };

/**
 * Metadata for a single marketing page. Canonical lives here, never in the root layout,
 * because child pages would otherwise inherit the home page's canonical URL.
 */
export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  // Open Graph and Twitter titles do not get the title template, so compose the final text here.
  const fullTitle = absoluteTitle ? title : siteConfig.titleTemplate.replace("%s", title);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}

type OrganizationJsonLd = {
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
};

type WebSiteJsonLd = {
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  inLanguage: string;
  publisher: { "@id": string };
};

export type SiteJsonLd = {
  "@context": "https://schema.org";
  "@graph": [OrganizationJsonLd, WebSiteJsonLd];
};

/**
 * Organization and WebSite markup only. Product, Offer, Review and FAQ markup are deliberately
 * absent: there are no real prices or reviews, and marking up content that is not on the page
 * breaks Google's structured data guidelines.
 */
export function buildSiteJsonLd(): SiteJsonLd {
  const homeUrl = absoluteUrl("/");
  const organizationId = `${homeUrl}/#organization`;

  const organization: OrganizationJsonLd = {
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    url: homeUrl,
    logo: absoluteUrl(siteConfig.logoPath),
  };
  if (siteConfig.socialLinks.length > 0) {
    organization.sameAs = [...siteConfig.socialLinks];
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${homeUrl}/#website`,
        name: siteConfig.name,
        url: homeUrl,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/**
 * Serialises JSON-LD for an inline `<script>`. Escaping `<` stops any value from closing the
 * script tag early (`</script>`), which is what makes this `dangerouslySetInnerHTML` use safe.
 */
export function serializeJsonLd(data: SiteJsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
