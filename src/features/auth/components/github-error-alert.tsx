"use client";

import { useSearchParams } from "next/navigation";

import { AuthAlert } from "@/features/auth/components/auth-alert";

/**
 * Shown on `/login` when better-auth sends the browser back from a failed GitHub sign-in: it adds
 * `?error=<code>` to the `errorCallbackURL`. The code itself is technical, so a plain message is
 * shown instead. Must sit inside a `Suspense` boundary because it reads the search params.
 *
 * @packageDocumentation
 */

export function GithubErrorAlert() {
  const searchParams = useSearchParams();
  if (!searchParams.has("error")) {
    return null;
  }
  return (
    <AuthAlert
      tone="error"
      title="GitHub sign-in did not finish"
      message="Please try again, or use your email and password."
    />
  );
}
