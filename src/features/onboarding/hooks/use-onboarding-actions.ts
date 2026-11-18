"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api-error";
import {
  completeOnboarding,
  connectGithub,
  getSuggestedTasks,
  lookupStartup,
} from "@/features/onboarding/services/onboarding-service";
import type {
  FocusValue,
  GithubConnection,
  OnboardingDraft,
  OnboardingStatus,
  StartupLookup,
} from "@/features/onboarding/types/onboarding-types";

/**
 * Mutation hooks for the onboarding steps: landing page lookup, GitHub connection, first task
 * suggestions and completion. Completion stores the new status in the Query cache so the rest of
 * the app sees onboarding as done (docs/STATE_AND_DATA.md, mutations on fixtures).
 *
 * @packageDocumentation
 */

export const onboardingQueryKeys = {
  status: ["onboarding", "status"],
} as const;

export function useStartupLookup() {
  return useMutation<StartupLookup, ApiError, string>({ mutationFn: lookupStartup });
}

export function useConnectGithub() {
  return useMutation<GithubConnection, ApiError, string>({ mutationFn: connectGithub });
}

export function useSuggestTasks() {
  return useMutation<readonly string[], ApiError, FocusValue>({ mutationFn: getSuggestedTasks });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation<OnboardingStatus, ApiError, OnboardingDraft>({
    mutationFn: completeOnboarding,
    onSuccess: (status) => {
      // FIXTURE: with the API this becomes an invalidation of `GET /onboarding/status`.
      queryClient.setQueryData(onboardingQueryKeys.status, status);
    },
  });
}
