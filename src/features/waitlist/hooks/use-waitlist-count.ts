"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { getWaitlistCount } from "@/features/waitlist/services/waitlist-service";
import type { WaitlistCount } from "@/features/waitlist/types/waitlist-types";

/**
 * Query hook for the number of people on the waitlist (`GET /api/v1/waitlist/count`). Uses the
 * shared query defaults; `useJoinWaitlist` invalidates `waitlistQueryKeys.count` after a signup.
 *
 * @packageDocumentation
 */

export const waitlistQueryKeys = {
  count: ["waitlist", "count"],
} as const;

export function useWaitlistCount() {
  return useQuery<WaitlistCount, ApiError>({
    queryKey: waitlistQueryKeys.count,
    queryFn: getWaitlistCount,
  });
}
