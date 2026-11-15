"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { waitlistQueryKeys } from "@/features/waitlist/hooks/use-waitlist-count";
import { joinWaitlist } from "@/features/waitlist/services/waitlist-service";
import type { JoinWaitlistRequest, WaitlistEntry } from "@/features/waitlist/types/waitlist-types";

/**
 * Mutation hook for joining the waitlist. Wraps `joinWaitlist` in TanStack Query and runs the
 * caller's `onSuccess` and `onError` handlers. A successful signup refetches the waitlist count
 * so the number on the page includes the new entry.
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
      void queryClient.invalidateQueries({ queryKey: waitlistQueryKeys.count });
      onSuccess?.(entry);
    },
    onError: (error) => onError?.(error),
  });
}
