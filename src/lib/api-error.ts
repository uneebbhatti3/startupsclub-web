import type { ApiErrorDetail } from "@/types/api-types";

/**
 * The one error type every API call rejects with (thrown by the Axios client's interceptor), so
 * hooks and components can branch on `status` and `code` without knowing about Axios.
 *
 * @packageDocumentation
 */

type ApiErrorInit = {
  /** HTTP status, or `null` when no response arrived (network failure, CORS, server down). */
  status: number | null;
  code: string;
  message: string;
  details?: ApiErrorDetail[];
};

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly details: ApiErrorDetail[];

  constructor({ status, code, message, details = [] }: ApiErrorInit) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Expected failures (`4xx`) are handled in the UI and never retried or reported. */
  get isClientError(): boolean {
    return this.status !== null && this.status >= 400 && this.status < 500;
  }
}
