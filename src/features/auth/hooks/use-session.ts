"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { getSession } from "@/features/auth/services/auth-service";
import type { AuthSession } from "@/features/auth/types/auth-types";

/**
 * Query hook for the current better-auth session (`GET /api/auth/get-session`). `data` is the
 * session and user, or `null` when signed out. Sign-in hooks invalidate `authQueryKeys.session`.
 *
 * @packageDocumentation
 */

export const authQueryKeys = {
  session: ["auth", "session"],
} as const;

export function useSession() {
  return useQuery<AuthSession, ApiError>({
    queryKey: authQueryKeys.session,
    queryFn: getSession,
  });
}
