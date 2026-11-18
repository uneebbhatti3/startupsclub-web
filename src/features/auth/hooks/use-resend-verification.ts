"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { resendVerificationEmail } from "@/features/auth/services/auth-service";

/**
 * Mutation hook for "Resend link" on `/verify-email`.
 *
 * @packageDocumentation
 */

export function useResendVerification() {
  return useMutation<void, ApiError, string>({
    mutationFn: resendVerificationEmail,
  });
}
