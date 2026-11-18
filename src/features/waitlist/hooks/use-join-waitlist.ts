"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { waitlistCountQuery } from "@/features/waitlist/hooks/use-waitlist-count";
import { expireWaitlistCount } from "@/features/waitlist/services/waitlist-count-actions";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import type { JoinWaitlistRequest, WaitlistEntry } from "@/features/waitlist/types/waitlist-types";

/**
 * Mutation hook for joining the waitlist. Wraps `joinWaitlist` in TanStack Query and runs the
 * caller's `onSuccess` and `onError` handlers. A successful signup fetches the waitlist count
 * again so the number on the page includes the new entry. It uses `fetchQuery` with
 * `staleTime: 0` rather than `invalidateQueries`, because the count query is disabled when the
 * page supplied a server count, and invalidation never refetches a disabled query. If that fetch
 * fails, the previous count simply stays on screen. It also expires the server-cached count
 * (`expireWaitlistCount`, D44), so a page reload shows the new number too.
 *
 * @packageDocumentation
 */

type UseJoinWaitlistOptions = {
  onSuccess?: (entry: WaitlistEntry) => void;
  onError?: (error: ApiError) => void;
};

export function useJoinWaitlist({ onSuccess, onError }: UseJoinWaitlistOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation<WaitlistEntry, ApiError, JoinWaitlistRequest>({
    mutationFn: joinWaitlist,
    onSuccess: (entry) => {
      queryClient.fetchQuery({ ...waitlistCountQuery, staleTime: 0 }).catch(() => undefined);
      // Without this, a reload shows the count cached on the server before the signup.
      expireWaitlistCount().catch(() => undefined);
      onSuccess?.(entry);
    },
    onError: (error) => onError?.(error),
  });
}
