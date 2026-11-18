/**
 * Request and response shapes for the better-auth routes under `/api/auth/*`
 * (backend docs/AUTH.md section 1). These are better-auth's own bodies, not the API envelope.
 *
 * @packageDocumentation
 */

/** The user better-auth returns. Dates arrive as ISO strings. */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

/** The session record better-auth returns with `get-session`. */
export type AuthSessionRecord = {
  id: string;
  userId: string;
  expiresAt: string;
};

/** `GET /api/auth/get-session`: the current session, or `null` when signed out. */
export type AuthSession = {
  session: AuthSessionRecord;
  user: AuthUser;
} | null;

/** `POST /api/auth/sign-up/email`. */
export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

/** `POST /api/auth/sign-in/email`. */
export type SignInRequest = {
  email: string;
  password: string;
};

/** Sign-up and sign-in both answer `{ token, user }`; `token` is `null` until verified. */
export type AuthResult = {
  token: string | null;
  user: AuthUser;
};

/** `POST /api/auth/sign-in/social`: where to send the browser next (GitHub). */
export type SocialSignInResult = {
  url: string;
  redirect: boolean;
};
