import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Generates /robots.txt. Production allows all crawlers, AI crawlers included (owner decision,
 * 12 Nov 2026). Every other environment blocks everything so previews are never indexed.
 * Private app and auth pages are kept out of search with noindex metadata, not Disallow: a
 * disallowed URL is never crawled, so its noindex is never seen.
 *
 * @packageDocumentation
 */

export default function robots(): MetadataRoute.Robots {
  if (!env.isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /monitoring-tunnel is the Sentry tunnel route (docs/MONITORING.md).
      disallow: ["/api/", "/monitoring-tunnel"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
