"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/use-dashboard";
import { addStandupItem, createStandup } from "@/features/dashboard/services/dashboard-service";
import type {
  AddStandupItemInput,
  CreateStandupInput,
  Dashboard,
  StandupItem,
  TodayStandup,
} from "@/features/dashboard/types/dashboard-types";

/**
 * Mutation hooks for writing today's standup from the dashboard: post it, and add an item after
 * posting. Each writes the saved result into the cached dashboard so the card updates at once.
 *
 * @packageDocumentation
 */

export function useCreateStandup() {
  const queryClient = useQueryClient();
  return useMutation<TodayStandup, ApiError, CreateStandupInput>({
    mutationFn: createStandup,
    onSuccess: (standup) => {
      // FIXTURE: with the API, also invalidate `dashboardQueryKeys.summary` so streak and club
      // stats refresh. Refetching the fixture now would remove the new standup.
      queryClient.setQueryData<Dashboard>(dashboardQueryKeys.summary, (dashboard) =>
        dashboard ? { ...dashboard, today: standup } : dashboard,
      );
    },
  });
}

export function useAddStandupItem() {
  const queryClient = useQueryClient();
  return useMutation<StandupItem, ApiError, AddStandupItemInput>({
    mutationFn: addStandupItem,
    onSuccess: (item, input) => {
      queryClient.setQueryData<Dashboard>(dashboardQueryKeys.summary, (dashboard) => {
        if (!dashboard?.today || dashboard.today.id !== input.standupId) {
          return dashboard;
        }
        return {
          ...dashboard,
          today: { ...dashboard.today, items: [...dashboard.today.items, item] },
        };
      });
    },
  });
}
