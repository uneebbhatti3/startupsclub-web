"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { signUpWithEmail } from "@/features/auth/services/auth-service";
import type { AuthResult, SignUpRequest } from "@/features/auth/types/auth-types";

/**
 * Mutation hook for email sign-up. The backend sends a verification email and creates no
 * session, so there is nothing to refresh; the caller moves on to `/verify-email`.
 *
 * @packageDocumentation
 */

type UseSignUpOptions = {
  onSuccess?: (result: AuthResult, request: SignUpRequest) => void;
};

export function useSignUp({ onSuccess }: UseSignUpOptions = {}) {
  return useMutation<AuthResult, ApiError, SignUpRequest>({
    mutationFn: signUpWithEmail,
    onSuccess: (result, request) => onSuccess?.(result, request),
  });
}
