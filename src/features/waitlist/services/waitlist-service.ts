import { apiClient } from "@/services/api-client";
import type { ApiSuccess } from "@/types/api-types";
import type {
  JoinWaitlistRequest,
  WaitlistCount,
  WaitlistEntry,
} from "@/features/waitlist/types/waitlist-types";

/**
 * API calls for the waitlist. Only calls the API and returns the data; failures reject with
 * `ApiError` (converted in the Axios client).
 *
 * @packageDocumentation
 */

/** `POST /waitlist`: adds someone to the waitlist and returns the saved entry. */
export async function joinWaitlist(payload: JoinWaitlistRequest): Promise<WaitlistEntry> {
  const response = await apiClient.post<ApiSuccess<WaitlistEntry>>("/waitlist", payload);
  return response.data.data;
}

type RequestOptions = {
  /** Milliseconds before the request is abandoned. Unset means no limit (Axios default). */
  timeout?: number;
};

/** `GET /waitlist/count`: returns how many people are on the waitlist. */
export async function getWaitlistCount(options: RequestOptions = {}): Promise<WaitlistCount> {
  const response = await apiClient.get<ApiSuccess<WaitlistCount>>("/waitlist/count", {
    timeout: options.timeout,
  });
  return response.data.data;
}
