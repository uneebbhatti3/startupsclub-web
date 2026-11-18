"use server";

import { updateTag } from "next/cache";

import { waitlistCountCacheTag } from "@/features/waitlist/services/waitlist-count-cache";

/**
 * Server Action called after a successful waitlist signup (D44). It expires the server-cached
 * count (`getCachedWaitlistCount`, D35), so the next load of /waitlist fetches the new number
 * instead of showing the cached one for up to 5 minutes. It changes no data and takes no input;
 * at worst a caller makes the next page load ask the API for the count again.
 *
 * @packageDocumentation
 */

export async function expireWaitlistCount(): Promise<void> {
  updateTag(waitlistCountCacheTag);
}
