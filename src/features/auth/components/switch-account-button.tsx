"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

/**
 * "Switch account": signs out and opens `/login`. Used under the onboarding card next to
 * "Signed in as …". If sign-out fails, the button says so and can be pressed again.
 *
 * @packageDocumentation
 */

export function SwitchAccountButton() {
  const router = useRouter();
  const signOut = useSignOut({ onSuccess: () => router.replace("/login") });

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="h-auto p-0 text-primary-text"
      disabled={signOut.isPending || signOut.isSuccess}
      onClick={() => signOut.mutate()}
    >
      {signOut.isPending
        ? "Signing out…"
        : signOut.isError
          ? "Sign out failed, retry"
          : "Switch account"}
    </Button>
  );
}
