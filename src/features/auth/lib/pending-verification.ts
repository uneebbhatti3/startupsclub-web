/**
 * Remembers, for this browser tab only, the email address waiting for verification, so
 * `/verify-email` can resend the link. `sessionStorage` keeps the address out of the URL, browser
 * history and server logs (SECURITY.md). It is not a token and holds nothing secret. Storage can
 * be unavailable (private mode, blocked site data), so every access is guarded.
 *
 * @packageDocumentation
 */

const storageKey = "startupsclub:pending-verification-email";

export function savePendingVerificationEmail(email: string): void {
  try {
    sessionStorage.setItem(storageKey, email);
  } catch {
    // Without storage, /verify-email asks for the address instead.
  }
}

export function readPendingVerificationEmail(): string {
  try {
    return sessionStorage.getItem(storageKey) ?? "";
  } catch {
    return "";
  }
}
