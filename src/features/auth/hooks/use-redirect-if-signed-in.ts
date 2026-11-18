"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/features/auth/hooks/use-session";
import { afterSignInPath } from "@/features/auth/lib/auth-config";

/**
 * Sends a visitor who is already signed in from `/login` or `/signup` to the post-sign-in page
 * (owner's choice). The check runs in the browser because the session cookie belongs to the API
 * origin, so this site's server cannot see it. If the check fails, the form simply stays usable.
 *
 * @packageDocumentation
 */

export function useRedirectIfSignedIn(): void {
  const router = useRouter();
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);

  useEffect(() => {
    if (isSignedIn) {
      router.replace(afterSignInPath);
    }
  }, [isSignedIn, router]);
}
