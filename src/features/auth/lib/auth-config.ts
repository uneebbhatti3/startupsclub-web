import { env } from "@/config/env";

/**
 * Fixed values for the auth flow: where better-auth sends the browser after verification or
 * GitHub, the password limits (better-auth defaults, backend docs/AUTH.md section 2) and the
 * error codes the screens react to.
 *
 * @packageDocumentation
 */

/** Where a returning, signed-in user lands. The home page until the app area exists (D36). */
export const afterSignInPath = "/";

/** Where a brand-new account goes first (D37). */
export const onboardingPath = "/onboarding";

/** Absolute URLs better-auth redirects to. They must be on a trusted origin of the backend. */
export const authCallbackURLs = {
  afterSignIn: `${env.siteUrl}${afterSignInPath}`,
  /**
   * After opening the verification link. Only new accounts verify, so it leads to onboarding.
   * Also sent with email sign-in, because better-auth uses it for the fresh link it emails to an
   * unverified member who tries to log in.
   */
  afterVerification: `${env.siteUrl}${onboardingPath}`,
  /** better-auth uses this instead of `afterSignIn` when GitHub creates a new account. */
  newGithubUser: `${env.siteUrl}${onboardingPath}`,
  /** better-auth appends `?error=<code>` to this URL when GitHub sign-in fails. */
  githubError: `${env.siteUrl}/login`,
} as const;

export const passwordLimits = { min: 8, max: 128 } as const;

/** better-auth error codes the UI handles specially. */
export const authErrorCodes = {
  emailNotVerified: "EMAIL_NOT_VERIFIED",
} as const;
