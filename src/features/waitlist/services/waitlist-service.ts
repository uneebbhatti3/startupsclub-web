import { apiClient } from "@/services/api-client";
import type { ApiSuccess } from "@/types/api-types";
import type { JoinWaitlistRequest, WaitlistEntry } from "@/features/waitlist/types/waitlist-types";

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
