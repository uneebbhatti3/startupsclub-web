import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-error";

/**
 * Creates the TanStack Query client with the defaults in docs/STATE_AND_DATA.md section 5:
 * 30 s stale time, refetch on window focus, one retry for queries but never for `4xx` errors,
 * and no retries for mutations (a repeated POST could create duplicates).
 *
 * The global Sentry `onError` on the query and mutation caches belongs here too; it is not added
 * yet because `@sentry/nextjs` is not installed in this repository.
 *
 * @packageDocumentation
 */

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.isClientError) && failureCount < 1,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
