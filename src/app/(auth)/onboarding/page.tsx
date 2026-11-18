import type { Metadata } from "next";

import { OnboardingScreen } from "@/app/(auth)/onboarding/onboarding-screen";

/**
 * Onboarding page (/onboarding): the first stop for a new account after email verification or a
 * first GitHub sign-in (D37). `noindex` and not in the sitemap (D4).
 *
 * @packageDocumentation
 */

export const metadata: Metadata = {
  title: "Set Up Your Account",
  description: "Set up your StartupsClub profile, startups, focus and first tasks.",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
