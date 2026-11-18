"use client";

import { useSession } from "@/features/auth/hooks/use-session";
import { SiteHeader } from "@/features/marketing/components/site-header";

/**
 * Composes the `auth` and `marketing` features for the marketing header (a feature may not import
 * another feature, so the route does it, as in D37). Signed-in visitors see "Dashboard" instead
 * of "Log in" and "Sign up" (D39). The session is checked in the browser, so the prerendered page
 * and visitors whose check is still loading or failed see the signed-out buttons.
 *
 * @packageDocumentation
 */

export function MarketingHeader() {
  const { data: session } = useSession();
  return <SiteHeader isSignedIn={Boolean(session?.user)} />;
}
