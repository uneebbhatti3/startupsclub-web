import type { Metadata } from "next";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResendVerificationForm } from "@/features/auth/components/resend-verification-form";
import { hero } from "@/features/marketing/lib/content/home";

/**
 * Verify-email page (/verify-email), reached after email sign-up or a log-in before verifying.
 * It explains that a link was emailed and offers to resend it. `noindex` and not in the sitemap
 * (D4). The form reads the address from `sessionStorage`, so it renders in the browser only; the
 * fallback is the disabled button.
 *
 * @packageDocumentation
 */

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Open the link we emailed you to finish creating your StartupsClub account.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Check your email"
      description="Open the link we emailed you to finish creating your account."
      alternate={{ prompt: "Already verified?", label: "Log in", href: "/login" }}
      panelTitleLines={hero.titleLines}
      panelDescription={hero.description}
    >
      <Suspense
        fallback={
          <Button variant="outline" size="lg" className="w-full" disabled>
            Resend link
          </Button>
        }
      >
        <ResendVerificationForm />
      </Suspense>
    </AuthShell>
  );
}
