import { cacheLife, cacheTag } from "next/cache";

import { getWaitlistCount } from "@/features/waitlist/services/waitlist-service";

/**
 * Server-side, cached waitlist count for the /waitlist page (D35). The API is hosted on Render,
 * which sleeps when idle and can take close to a minute to wake, so asking for the count in the
 * browser left the page without a number. Fetching it here puts the number in the page HTML; the
 * browser then uses it as the query's initial data instead of waiting for the API.
 *
 * The entry is tagged `waitlist-count`; a successful signup expires it through the
 * `expireWaitlistCount` Server Action, so the next page load reads the new count (D44).
 *
 * Server only: called from the page, never from a client component.
 *
 * @packageDocumentation
 */

/** Cache tag for the waitlist count. Expired after every signup (D44). */
export const waitlistCountCacheTag = "waitlist-count";

/** Stays under Next's 50 s limit for filling a cache during the build. */
const SERVER_TIMEOUT_MS = 20_000;

/**
 * The waitlist count, or `null` if the API could not be reached in time. A count is reused for
 * 5 minutes; a failure only for 1 minute, so a sleeping API is retried soon. On `null` the page
 * falls back to fetching the count in the browser. Sentry is not installed yet, so the failure is
 * not reported (docs/MONITORING.md).
 */
export async function getCachedWaitlistCount(): Promise<number | null> {
  "use cache";
  cacheTag(waitlistCountCacheTag);
  try {
    const { count } = await getWaitlistCount({ timeout: SERVER_TIMEOUT_MS });
    cacheLife({ stale: 300, revalidate: 300 });
    return count;
  } catch {
    cacheLife({ stale: 60, revalidate: 60 });
    return null;
  }
}
