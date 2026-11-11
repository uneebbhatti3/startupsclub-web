import { env } from "@/config/env";

/**
 * Single source of truth for site identity and the list of public marketing routes.
 * Root metadata, page metadata, JSON-LD, the sitemap and llms.txt all read from here so they
 * cannot drift apart.
 *
 * @packageDocumentation
 */

export type SitePath = "/" | `/${string}`;

export type MarketingRoute = {
  readonly path: SitePath;
  readonly title: string;
  readonly description: string;
  /** ISO date (YYYY-MM-DD) of the last real content change. Update it when the page changes. */
  readonly lastModified: string;
  /** Use the title as-is instead of applying the "%s | StartupsClub" template. */
  readonly absoluteTitle?: boolean;
  /** Lower-priority pages (changelog, legal) go under "## Optional" in llms.txt. */
  readonly optional?: boolean;
};

export const siteConfig = {
  name: "StartupsClub",
  shortName: "StartupsClub",
  defaultTitle: "StartupsClub: Accountability Club for Founders & Developers",
  titleTemplate: "%s | StartupsClub",
  description:
    "StartupsClub helps founders and developers build consistently: post a daily standup, log what you ship, and stay accountable in a small club. Free to start.",
  locale: "en_US",
  url: env.siteUrl,
  category: "productivity, business, technology",
  author: "Uneeb Bhatti",
  logoPath: "/logo.png",
  /**
   * Social share image served by the `src/app/opengraph-image.png` file convention. Pages that
   * set their own `openGraph` replace the inherited file image, so `createPageMetadata` passes
   * this explicitly. `alt` must match `src/app/opengraph-image.alt.txt` (checked in e2e).
   */
  ogImage: {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    alt: 'StartupsClub: Show up daily. Ship what you said. Post a daily standup, log what you ship, and let a small club keep you honest. A six-week grid of blue squares tracks daily check-ins, with a "Standup posted" confirmation.',
  },
  themeColor: { light: "#FFFFFF", dark: "#0A0A0A" },
  /** Confirmed public profiles only. None exist yet (owner, 12 Nov 2026). */
  socialLinks: [] as readonly string[],
} as const;

/**
 * Public, indexable routes that exist in `src/app/(marketing)`. Add a route here only once its
 * page is built.
 */
export const marketingRoutes = [
  {
    path: "/",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    lastModified: "2026-11-12",
    absoluteTitle: true,
  },
] as const satisfies readonly MarketingRoute[];

export type MarketingPath = (typeof marketingRoutes)[number]["path"];

/** Looks up a marketing route by path; typed so only existing routes can be requested. */
export function getMarketingRoute(path: MarketingPath): MarketingRoute {
  const route = marketingRoutes.find((entry) => entry.path === path);
  if (!route) {
    throw new Error(`Unknown marketing route: ${path}`);
  }
  return route;
}
