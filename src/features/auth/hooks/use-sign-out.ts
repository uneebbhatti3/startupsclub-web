"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { signOut } from "@/features/auth/services/auth-service";

/**
 * Mutation hook for signing out. On success it clears every cached query, so no data from the
 * previous account is shown to the next one, then runs the caller's `onSuccess`.
 *
 * @packageDocumentation
 */

type UseSignOutOptions = {
  onSuccess?: () => void;
};

export function useSignOut({ onSuccess }: UseSignOutOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.clear();
      onSuccess?.();
    },
  });
}
