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
 * page is built. `/waitlist` is public again (D43).
 */
export const marketingRoutes = [
  {
    path: "/",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    lastModified: "2026-11-18",
    absoluteTitle: true,
  },
  {
    path: "/features",
    title: "Features",
    description:
      "Daily standups, ship logs, clubs and six-week seasons, a post composer for StartupsClub and LinkedIn, and private AI coaching on Pro.",
    lastModified: "2026-11-18",
  },
  {
    path: "/pricing",
    title: "Pricing: Free and Pro Plans",
    description:
      "Start free with daily standups, ship logs, clubs and seasons. Pro adds post scheduling, a higher AI post quota and private AI coaching.",
    lastModified: "2026-11-18",
  },
  {
    path: "/waitlist",
    title: "Join the Waitlist",
    description:
      "Join the StartupsClub waitlist for early access: post a daily standup, log what you ship and stay accountable in a small club of builders.",
    lastModified: "2026-11-18",
  },
] as const satisfies readonly MarketingRoute[];

/** Marketing routes that are listed publicly (sitemap, llms.txt). */
export const listedMarketingRoutes: readonly MarketingRoute[] = marketingRoutes;

export type MarketingPath = (typeof marketingRoutes)[number]["path"];

/** Looks up a marketing route by path; typed so only existing routes can be requested. */
export function getMarketingRoute(path: MarketingPath): MarketingRoute {
  const route = marketingRoutes.find((entry) => entry.path === path);
  if (!route) {
    throw new Error(`Unknown marketing route: ${path}`);
  }
  return route;
}

/**
 * Indexable routes in `src/app/(auth)` (D4). Every other auth route is noindex and must not be
 * added here. Marked `optional` so llms.txt lists them after the marketing pages.
 */
export const authRoutes = [
  {
    path: "/login",
    title: "Log In to Your Account",
    description:
      "Log in to StartupsClub to post your daily standup, log what you shipped and check in with your accountability club. Sign in with GitHub or email.",
    lastModified: "2026-11-17",
    optional: true,
  },
  {
    path: "/signup",
    title: "Sign Up Free: Join an Accountability Club",
    description:
      "Create your free StartupsClub account. Post a daily standup, log what you ship and stay accountable in a small club of founders and developers.",
    lastModified: "2026-11-17",
    optional: true,
  },
] as const satisfies readonly MarketingRoute[];

export type AuthPath = (typeof authRoutes)[number]["path"];

/** Looks up an indexable auth route by path; typed so only existing routes can be requested. */
export function getAuthRoute(path: AuthPath): MarketingRoute {
  const route = authRoutes.find((entry) => entry.path === path);
  if (!route) {
    throw new Error(`Unknown auth route: ${path}`);
  }
  return route;
}

/** Every route listed in the sitemap and llms.txt: listed marketing pages, then auth pages. */
export const listedPublicRoutes: readonly MarketingRoute[] = [
  ...listedMarketingRoutes,
  ...authRoutes,
];
