"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { startGithubSignIn } from "@/features/auth/services/auth-service";
import type { SocialSignInResult } from "@/features/auth/types/auth-types";

/**
 * Mutation hook for "Continue with GitHub" (sign-up and sign-in are the same call). On success
 * the browser leaves for GitHub; GitHub returns to the backend, which sets the session cookie and
 * redirects to the post-sign-in page, or to `/login?error=…` on failure.
 *
 * @packageDocumentation
 */

export function useGithubSignIn() {
  return useMutation<SocialSignInResult, ApiError, void>({
    mutationFn: () => startGithubSignIn(),
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
}
