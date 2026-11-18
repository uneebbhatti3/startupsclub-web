"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { getWaitlistCount } from "@/features/waitlist/services/waitlist-service";
import type { WaitlistCount } from "@/features/waitlist/types/waitlist-types";

/**
 * Query hook for the number of people on the waitlist (`GET /api/v1/waitlist/count`), returning
 * the count to show: the latest fetched value, else the server-cached `initialCount` from the
 * page (D35). With a server count the query is disabled, so nothing is requested on load, and
 * the server count is not put into the query cache during render (TanStack timestamps cache
 * data with `Date.now()`, which Cache Components forbids in a prerendered client component).
 * The count never refetches by itself (no stale time, no refetch on focus); it changes only when
 * `useJoinWaitlist` fetches `waitlistCountQuery` again after a signup (owner's choice).
 *
 * @packageDocumentation
 */

export const waitlistQueryKeys = {
  count: ["waitlist", "count"],
} as const;

/** Shared by the hook and by the refresh after a signup. */
export const waitlistCountQuery = {
  queryKey: waitlistQueryKeys.count,
  queryFn: () => getWaitlistCount(),
};

export function useWaitlistCount(initialCount: number | null): number | null {
  const { data } = useQuery<WaitlistCount, ApiError>({
    ...waitlistCountQuery,
    enabled: initialCount === null,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  return data?.count ?? initialCount;
}
