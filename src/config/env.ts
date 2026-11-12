/**
 * Validated environment values used by site-wide configuration and SEO.
 * Reads `NEXT_PUBLIC_SITE_URL` (required), the optional Google Search Console token, and
 * whether this build is the production deployment.
 *
 * @packageDocumentation
 */

/**
 * Returns the site origin from `NEXT_PUBLIC_SITE_URL` with no trailing slash.
 * Fails loudly instead of falling back to a guessed domain, so a misconfigured deployment can
 * never publish canonical URLs, sitemaps or Open Graph links that point somewhere else.
 */
function readSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL as string;
  if (!raw) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set. Copy .env.example to .env.local.");
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL such as https://example.com.");
  }

  const hasExtraParts = parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "";
  if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || hasExtraParts) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an http(s) origin with no path, query or hash.");
  }

  return parsed.origin;
}

function readOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const env = {
  /** Site origin, for example `https://example.com` (no trailing slash). */
  siteUrl: readSiteUrl(),
  /** Google Search Console verification token, when the owner has provided one. */
  googleSiteVerification: readOptional(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
  /**
   * True only for the Vercel production deployment. `VERCEL_ENV` is not public, so this is
   * only meaningful on the server (metadata, robots, sitemap), which is the only place it is used.
   */
  isProduction: process.env.VERCEL_ENV === "production",
} as const;
