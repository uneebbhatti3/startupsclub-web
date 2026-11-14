/**
 * Response envelopes shared by every NestJS endpoint (docs/STATE_AND_DATA.md section 6).
 * Success: `{ data, meta? }`. Failure: `{ error: { code, message, details } }`.
 *
 * @packageDocumentation
 */

/** Successful response body. */
export type ApiSuccess<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

/** One field that failed server-side validation. */
export type ApiErrorDetail = {
  field: string;
  messages: string[];
};

/** Failure response body. `message` is safe to show to the user. */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details: ApiErrorDetail[];
  };
};
