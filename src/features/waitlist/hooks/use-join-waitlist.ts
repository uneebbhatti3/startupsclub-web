"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import type { JoinWaitlistRequest, WaitlistEntry } from "@/features/waitlist/types/waitlist-types";

/**
 * Mutation hook for joining the waitlist. Wraps `joinWaitlist` in TanStack Query and runs the
 * caller's `onSuccess` and `onError` handlers. No query cache is touched: nothing on the site
 * reads waitlist data back.
 *
 * @packageDocumentation
 */

type UseJoinWaitlistOptions = {
  onSuccess?: (entry: WaitlistEntry) => void;
  onError?: (error: ApiError) => void;
};

export function useJoinWaitlist({ onSuccess, onError }: UseJoinWaitlistOptions = {}) {
  return useMutation<WaitlistEntry, ApiError, JoinWaitlistRequest>({
    mutationFn: joinWaitlist,
    onSuccess: (entry) => onSuccess?.(entry),
    onError: (error) => onError?.(error),
  });
}
