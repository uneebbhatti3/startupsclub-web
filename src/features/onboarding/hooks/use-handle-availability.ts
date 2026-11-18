"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { ApiError } from "@/lib/api-error";
import { handlePattern, onboardingLimits } from "@/features/onboarding/lib/onboarding-content";
import { checkHandleAvailability } from "@/features/onboarding/services/onboarding-service";
import type { HandleAvailability } from "@/features/onboarding/types/onboarding-types";

/**
 * Checks a profile handle as the member types: first its format, then (after a short pause in
 * typing) whether it is free. Returns one status the profile step shows and the wizard uses to
 * allow "Continue".
 *
 * @packageDocumentation
 */

export type HandleStatus =
  | { state: "empty" }
  | { state: "invalid"; message: string }
  | { state: "checking" }
  | { state: "available" }
  | { state: "taken" }
  | { state: "error"; message: string };

const debounceMs = 400;

function formatError(handle: string): string | null {
  if (handle.length < onboardingLimits.handleMin) {
    return `Use at least ${onboardingLimits.handleMin} characters.`;
  }
  if (handle.length > onboardingLimits.handleMax) {
    return `Use at most ${onboardingLimits.handleMax} characters.`;
  }
  if (!handlePattern.test(handle)) {
    return "Use lowercase letters, numbers and underscores only.";
  }
  return null;
}

export function useHandleAvailability(handle: string): HandleStatus {
  const [debounced, setDebounced] = useState(handle);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(handle), debounceMs);
    return () => clearTimeout(timer);
  }, [handle]);

  const invalid = handle ? formatError(handle) : null;
  const query = useQuery<HandleAvailability, ApiError>({
    queryKey: ["onboarding", "handle-availability", debounced],
    queryFn: () => checkHandleAvailability(debounced),
    enabled: debounced !== "" && formatError(debounced) === null,
    staleTime: 60_000,
  });

  if (!handle) {
    return { state: "empty" };
  }
  if (invalid) {
    return { state: "invalid", message: invalid };
  }
  if (debounced !== handle || query.isPending) {
    return { state: "checking" };
  }
  if (query.isError) {
    return { state: "error", message: query.error.message };
  }
  return query.data.available ? { state: "available" } : { state: "taken" };
}
