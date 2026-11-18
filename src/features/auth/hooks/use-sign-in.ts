"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { authQueryKeys } from "@/features/auth/hooks/use-session";
import { signInWithEmail } from "@/features/auth/services/auth-service";
import type { AuthResult, SignInRequest } from "@/features/auth/types/auth-types";

/**
 * Mutation hook for email and password sign-in. A success refreshes the session query and runs
 * the caller's `onSuccess`; failures go to the caller's `onError`.
 *
 * @packageDocumentation
 */

type UseSignInOptions = {
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: ApiError, request: SignInRequest) => void;
};

export function useSignIn({ onSuccess, onError }: UseSignInOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation<AuthResult, ApiError, SignInRequest>({
    mutationFn: signInWithEmail,
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      onSuccess?.(result);
    },
    onError: (error, request) => onError?.(error, request),
  });
}
