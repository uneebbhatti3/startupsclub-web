import axios, { isAxiosError } from "axios";
import type { AxiosInstance } from "axios";

import { ApiError } from "@/lib/api-error";
import type { ApiErrorBody, ApiErrorDetail } from "@/types/api-types";

/**
 * The Axios instances for the NestJS backend (docs/STATE_AND_DATA.md section 6). Only files in a
 * `services/` folder may import them.
 *
 * - `apiClient`: the REST API at `NEXT_PUBLIC_API_BASE_URL` (versioned prefix included, for
 *   example `http://localhost:8000/api/v1`), with the `{ data }` / `{ error }` envelopes.
 * - `authClient`: better-auth at `NEXT_PUBLIC_AUTH_BASE_URL` + `/api/auth`. better-auth answers
 *   with its own bodies and its errors are `{ code, message }`, not the API envelope
 *   (backend docs/AUTH.md section 1).
 *
 * Both send the session cookie (`withCredentials`) and convert every failure to an
 * {@link ApiError}.
 *
 * @packageDocumentation
 */

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const authOrigin = process.env.NEXT_PUBLIC_AUTH_BASE_URL?.replace(/\/+$/, "");

/** Narrows an unknown response body to the API's failure envelope. */
function isApiErrorBody(body: unknown): body is ApiErrorBody {
  if (typeof body !== "object" || body === null || !("error" in body)) {
    return false;
  }
  const { error } = body as { error: unknown };
  return (
    typeof error === "object" &&
    error !== null &&
    typeof (error as { code?: unknown }).code === "string" &&
    typeof (error as { message?: unknown }).message === "string"
  );
}

/** better-auth's failure body. `code` is missing on a few errors, such as rate limiting. */
type BetterAuthErrorBody = { code?: string; message: string };

/** Narrows an unknown response body to better-auth's failure body. */
function isBetterAuthErrorBody(body: unknown): body is BetterAuthErrorBody {
  if (typeof body !== "object" || body === null) {
    return false;
  }
  const { code, message } = body as { code?: unknown; message?: unknown };
  return typeof message === "string" && (code === undefined || typeof code === "string");
}

function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    // Not a failed request but a fault before sending, such as a missing base URL. Name it in
    // development so it is not mistaken for the server being down.
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return new ApiError({
      status: null,
      code: "CLIENT_ERROR",
      message: "Something went wrong on our side. Please try again.",
    });
  }
  if (!error.response) {
    return new ApiError({
      status: null,
      code: "NETWORK_ERROR",
      message: "We could not reach the server. Check your connection and try again.",
    });
  }

  const { status, data } = error.response;
  if (isApiErrorBody(data)) {
    const details: ApiErrorDetail[] = Array.isArray(data.error.details) ? data.error.details : [];
    return new ApiError({ status, code: data.error.code, message: data.error.message, details });
  }
  if (isBetterAuthErrorBody(data)) {
    return new ApiError({ status, code: data.code ?? "AUTH_ERROR", message: data.message });
  }

  return new ApiError({
    status,
    code: "UNEXPECTED_RESPONSE",
    message: "Something went wrong on our side. Please try again.",
  });
}

/**
 * Creates an instance that refuses to run without its base URL: a build without the variable
 * must fail visibly, not call a relative URL on this site.
 */
function createClient(baseURL: string | undefined, variable: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  client.interceptors.request.use((config) => {
    if (!baseURL) {
      throw new Error(`${variable} is not set. Copy .env.example to .env.local.`);
    }
    return config;
  });
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
  );
  return client;
}

export const apiClient = createClient(apiBaseURL, "NEXT_PUBLIC_API_BASE_URL");

export const authClient = createClient(
  authOrigin ? `${authOrigin}/api/auth` : undefined,
  "NEXT_PUBLIC_AUTH_BASE_URL",
);
