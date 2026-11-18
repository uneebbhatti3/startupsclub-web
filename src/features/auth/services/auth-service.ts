import { authClient } from "@/services/api-client";
import { authCallbackURLs } from "@/features/auth/lib/auth-config";
import type {
  AuthResult,
  AuthSession,
  SignInRequest,
  SignUpRequest,
  SocialSignInResult,
} from "@/features/auth/types/auth-types";

/**
 * Calls to better-auth under `/api/auth/*` (backend docs/AUTH.md). The session is an httpOnly
 * cookie the browser stores and sends; nothing here reads or keeps a token. Failures reject with
 * `ApiError` (converted in the Axios client).
 *
 * @packageDocumentation
 */

/** `GET /get-session`: the current session, or `null` when signed out. */
export async function getSession(): Promise<AuthSession> {
  const response = await authClient.get<AuthSession>("/get-session");
  return response.data ?? null;
}

/** `POST /sign-up/email`: creates the account and sends a verification email. No session yet. */
export async function signUpWithEmail(payload: SignUpRequest): Promise<AuthResult> {
  const response = await authClient.post<AuthResult>("/sign-up/email", {
    ...payload,
    callbackURL: authCallbackURLs.afterVerification,
  });
  return response.data;
}

/** `POST /sign-in/email`: sets the session cookie. 403 `EMAIL_NOT_VERIFIED` if unverified. */
export async function signInWithEmail(payload: SignInRequest): Promise<AuthResult> {
  const response = await authClient.post<AuthResult>("/sign-in/email", {
    ...payload,
    callbackURL: authCallbackURLs.afterVerification,
  });
  return response.data;
}

/** `POST /sign-in/social`: returns the GitHub URL to send the browser to (sign-up or sign-in). */
export async function startGithubSignIn(): Promise<SocialSignInResult> {
  const response = await authClient.post<SocialSignInResult>("/sign-in/social", {
    provider: "github",
    callbackURL: authCallbackURLs.afterSignIn,
    newUserCallbackURL: authCallbackURLs.newGithubUser,
    errorCallbackURL: authCallbackURLs.githubError,
  });
  return response.data;
}

/** `POST /send-verification-email`: sends a new verification link. */
export async function resendVerificationEmail(email: string): Promise<void> {
  await authClient.post("/send-verification-email", {
    email,
    callbackURL: authCallbackURLs.afterVerification,
  });
}

/** `POST /sign-out`: ends the session and clears the cookie. */
export async function signOut(): Promise<void> {
  await authClient.post("/sign-out", {});
}
