"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/use-dashboard";
import { setStandupItemDone } from "@/features/dashboard/services/dashboard-service";
import type {
  Dashboard,
  StandupItem,
  ToggleStandupItemInput,
} from "@/features/dashboard/types/dashboard-types";

/**
 * Mutation hook for ticking a standup item on the dashboard. The tick shows at once (optimistic
 * update of the cached dashboard) and is put back if saving fails, so ticking feels instant
 * (US-D2).
 *
 * @packageDocumentation
 */

type ToggleContext = {
  previous: Dashboard | undefined;
};

function withItemDone(dashboard: Dashboard, input: ToggleStandupItemInput): Dashboard {
  if (!dashboard.today || dashboard.today.id !== input.standupId) {
    return dashboard;
  }
  return {
    ...dashboard,
    today: {
      ...dashboard.today,
      items: dashboard.today.items.map((item) =>
        item.id === input.itemId ? { ...item, done: input.done } : item,
      ),
    },
  };
}

export function useToggleStandupItem() {
  const queryClient = useQueryClient();
  return useMutation<StandupItem, ApiError, ToggleStandupItemInput, ToggleContext>({
    mutationFn: setStandupItemDone,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: dashboardQueryKeys.summary });
      const previous = queryClient.getQueryData<Dashboard>(dashboardQueryKeys.summary);
      if (previous) {
        queryClient.setQueryData<Dashboard>(
          dashboardQueryKeys.summary,
          withItemDone(previous, input),
        );
      }
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dashboardQueryKeys.summary, context.previous);
      }
    },
    // FIXTURE: with the API, invalidate `dashboardQueryKeys.summary` in `onSettled` so the score
    // and streak refresh. Not done now because refetching the fixture would undo every tick.
  });
}
