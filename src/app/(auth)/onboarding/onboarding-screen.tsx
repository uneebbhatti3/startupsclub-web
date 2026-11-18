"use client";

import { SwitchAccountButton } from "@/features/auth/components/switch-account-button";
import { useRequireSession } from "@/features/auth/hooks/use-require-session";
import { afterSignInPath } from "@/features/auth/lib/auth-config";
import { OnboardingLoadError } from "@/features/onboarding/components/onboarding-load-error";
import { OnboardingSkeleton } from "@/features/onboarding/components/onboarding-skeleton";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

/**
 * Composes the `auth` and `onboarding` features for `/onboarding` (a feature may not import
 * another feature, so the route does it, D37). It requires a session (signed-out visitors go to
 * `/login`), shows a skeleton while checking, an error with retry if the check fails, and then
 * the wizard with the member's name and email.
 *
 * @packageDocumentation
 */

export function OnboardingScreen() {
  const session = useRequireSession();

  if (session.isError) {
    return (
      <OnboardingLoadError
        message={session.error.message}
        onRetry={() => void session.refetch()}
        isRetrying={session.isFetching}
      />
    );
  }
  if (!session.data) {
    return <OnboardingSkeleton />;
  }

  const { user } = session.data;
  return (
    <OnboardingWizard
      user={{ name: user.name, email: user.email }}
      accountAction={<SwitchAccountButton />}
      finishHref={afterSignInPath}
    />
  );
}
