"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/features/auth/hooks/use-session";

/**
 * For pages that need a signed-in member (such as `/onboarding`): returns the session query and
 * sends a signed-out visitor to `/login`. The check runs in the browser because the session
 * cookie belongs to the API origin. While it loads, or if it fails, the caller decides what to
 * show; only a confirmed "signed out" answer redirects.
 *
 * @packageDocumentation
 */

export function useRequireSession() {
  const router = useRouter();
  const session = useSession();
  const isSignedOut = session.isSuccess && session.data === null;

  useEffect(() => {
    if (isSignedOut) {
      router.replace("/login");
    }
  }, [isSignedOut, router]);

  return session;
}
