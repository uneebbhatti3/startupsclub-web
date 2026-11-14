import axios, { isAxiosError } from "axios";

import { ApiError } from "@/lib/api-error";
import type { ApiErrorBody, ApiErrorDetail } from "@/types/api-types";

/**
 * The single Axios instance for the NestJS API (docs/STATE_AND_DATA.md section 6). Only files in
 * a `services/` folder may import it. `baseURL` is `NEXT_PUBLIC_API_BASE_URL` (versioned prefix
 * included, for example `http://localhost:8000/api/v1`); `withCredentials` sends the session
 * cookie once authentication exists. Every failure is converted to an {@link ApiError}.
 *
 * @packageDocumentation
 */

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

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

function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error) || !error.response) {
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

  return new ApiError({
    status,
    code: "UNEXPECTED_RESPONSE",
    message: "Something went wrong on our side. Please try again.",
  });
}

apiClient.interceptors.request.use((config) => {
  if (!baseURL) {
    // A build without the variable must fail visibly, not call a relative URL on this site.
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local.");
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
