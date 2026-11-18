"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { getDashboard } from "@/features/dashboard/services/dashboard-service";
import type { Dashboard } from "@/features/dashboard/types/dashboard-types";

/**
 * Suspense query hook for the signed-in member's dashboard. Each card reads only its own slice
 * through `select`, so every card can sit in its own `<Suspense>` with its own skeleton, while all
 * of them share one request. While loading it suspends; a failure is thrown to the nearest error
 * boundary (`DashboardErrorBoundary`).
 *
 * @packageDocumentation
 */

export const dashboardQueryKeys = {
  summary: ["dashboard", "summary"],
} as const;

export function useDashboardSlice<TSlice>(select: (dashboard: Dashboard) => TSlice): TSlice {
  return useSuspenseQuery<Dashboard, ApiError, TSlice>({
    queryKey: dashboardQueryKeys.summary,
    queryFn: getDashboard,
    select,
  }).data;
}
