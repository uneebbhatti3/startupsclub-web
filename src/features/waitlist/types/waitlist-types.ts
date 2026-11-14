/**
 * Types for the waitlist feature. The request and response shapes mirror the API's
 * `CreateWaitlistEntryDto` and `WaitlistEntryResponseDto` (`POST /api/v1/waitlist`).
 *
 * @packageDocumentation
 */

/** Roles the API accepts (lowercase). */
export type WaitlistRole = "founder" | "developer" | "other";

/**
 * The form's values, held by `useFormHandler`. `role` is empty until the user picks one;
 * `roleOther` is only used (and only sent) when `role` is `"other"`.
 */
export type WaitlistFormData = {
  name: string;
  email: string;
  role: WaitlistRole | "";
  roleOther: string;
};

/** Body of `POST /waitlist`. `roleOther` must be present for `"other"` and absent otherwise. */
export type JoinWaitlistRequest = {
  name: string;
  email: string;
  role: WaitlistRole;
  roleOther?: string;
};

/** A saved waitlist entry, as returned in the success envelope's `data`. */
export type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  role: WaitlistRole;
  roleOther: string | null;
  /** ISO 8601 date-time (UTC). */
  createdAt: string;
};

/** Form fields that can show a server-side validation message. */
export type WaitlistField = keyof WaitlistFormData;
