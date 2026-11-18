"use client";

import { useState } from "react";

import { useHandleAvailability } from "@/features/onboarding/hooks/use-handle-availability";
import type { HandleStatus } from "@/features/onboarding/hooks/use-handle-availability";
import {
  useCompleteOnboarding,
  useSuggestTasks,
} from "@/features/onboarding/hooks/use-onboarding-actions";
import {
  defaultReminderTime,
  onboardingLimits,
  onboardingSteps,
  optionalSteps,
} from "@/features/onboarding/lib/onboarding-content";
import type { OnboardingStepId } from "@/features/onboarding/lib/onboarding-content";
import type {
  OnboardingDraft,
  ProfileDraft,
  StartupDraft,
  TaskDraft,
} from "@/features/onboarding/types/onboarding-types";

/**
 * State and navigation for the onboarding wizard: the current step, the draft every step edits,
 * whether "Continue" is allowed, and what "Continue", "Back" and "Skip" do. Progress lives in
 * memory for this visit only; a refresh starts again until the API can save steps (owner's
 * choice, D37). Moving on from "Focus" fetches suggested tasks; "Finish setup" completes
 * onboarding and shows the finish screen.
 *
 * @packageDocumentation
 */

/** A starting handle from the member's name: "Ada Lovelace" → "adalovelace". */
function handleFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, onboardingLimits.handleMax);
}

/** Local id for list keys; never sent to the API. */
export function newId(): string {
  return crypto.randomUUID();
}

export function blankStartup(): StartupDraft {
  return { id: newId(), url: "", name: "", tagline: "" };
}

function readTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function createDraft(name: string): OnboardingDraft {
  return {
    profile: { name, handle: handleFromName(name), location: "", bio: "", photo: null },
    startups: [blankStartup()],
    githubLogin: null,
    situation: null,
    skills: [],
    focus: null,
    tasksFocus: null,
    tasks: [],
    reminderTime: defaultReminderTime,
    timezone: readTimezone(),
    consent: false,
  };
}

function canContinue(
  step: OnboardingStepId,
  draft: OnboardingDraft,
  handleStatus: HandleStatus,
): boolean {
  switch (step) {
    case "profile":
      return draft.profile.name.trim() !== "" && handleStatus.state === "available";
    case "startups":
      return (
        draft.startups.length > 0 && draft.startups.every((startup) => startup.name.trim() !== "")
      );
    case "github":
      return true;
    case "situation":
      return draft.situation !== null;
    case "focus":
      return draft.focus !== null;
    case "tasks":
      return draft.tasks.some((task) => task.selected);
    case "reminders":
      return draft.reminderTime !== "" && draft.timezone !== "" && draft.consent;
  }
}

export function useOnboardingWizard({ name }: { name: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(() => createDraft(name));
  const [isFinished, setIsFinished] = useState(false);
  const handleStatus = useHandleAvailability(draft.profile.handle);
  const suggestTasks = useSuggestTasks();
  const complete = useCompleteOnboarding();

  const step = onboardingSteps[stepIndex] ?? onboardingSteps[0];

  function update<K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }

  function updateProfile<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
    setDraft((previous) => ({ ...previous, profile: { ...previous.profile, [key]: value } }));
  }

  function goTo(index: number) {
    setStepIndex(Math.min(Math.max(index, 0), onboardingSteps.length - 1));
  }

  function next() {
    if (!canContinue(step.id, draft, handleStatus)) {
      return;
    }
    const { focus } = draft;
    if (step.id === "focus" && focus && focus !== draft.tasksFocus) {
      // A new focus replaces the suggestions; tasks the member typed themselves are kept.
      suggestTasks.mutate(focus, {
        onSuccess: (titles) => {
          setDraft((previous) => {
            const ownTasks = previous.tasks.filter((task) => task.id.startsWith("own-"));
            const suggested: TaskDraft[] = titles.map((title) => ({
              id: newId(),
              title,
              selected: true,
            }));
            return { ...previous, tasksFocus: focus, tasks: [...suggested, ...ownTasks] };
          });
          goTo(stepIndex + 1);
        },
      });
      return;
    }
    if (step.id === "reminders") {
      complete.mutate(draft, { onSuccess: () => setIsFinished(true) });
      return;
    }
    goTo(stepIndex + 1);
  }

  function skip() {
    if (step.id === "startups") {
      update("startups", []);
    }
    if (step.id === "github") {
      update("githubLogin", null);
    }
    goTo(stepIndex + 1);
  }

  return {
    step,
    stepIndex,
    stepCount: onboardingSteps.length,
    draft,
    update,
    updateProfile,
    handleStatus,
    canContinue: canContinue(step.id, draft, handleStatus),
    canSkip: optionalSteps.includes(step.id),
    isBusy: suggestTasks.isPending || complete.isPending,
    error: suggestTasks.error ?? complete.error,
    isFinished,
    next,
    back: () => goTo(stepIndex - 1),
    skip,
  };
}
