"use client";

import { ChevronLeft, CircleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FocusStep } from "@/features/onboarding/components/focus-step";
import { GithubStep } from "@/features/onboarding/components/github-step";
import { OnboardingFinish } from "@/features/onboarding/components/onboarding-finish";
import { ProfileStep } from "@/features/onboarding/components/profile-step";
import { RemindersStep } from "@/features/onboarding/components/reminders-step";
import { SituationStep } from "@/features/onboarding/components/situation-step";
import { StartupsStep } from "@/features/onboarding/components/startups-step";
import { TasksStep } from "@/features/onboarding/components/tasks-step";
import { useOnboardingWizard } from "@/features/onboarding/hooks/use-onboarding-wizard";

/**
 * The onboarding wizard (FR-ONB-2, layout from the owner's reference screenshots, D37): one card
 * with Back, step dots and Skip on top, the current step in the middle and one primary button at
 * the bottom, then the "Day 1" finish screen. Built only from shadcn components with the app
 * tier's rules (no page animations, primary blue as the one accent). Focus moves to the new
 * step's heading on every step change so screen reader and keyboard users know where they are.
 *
 * @packageDocumentation
 */

type OnboardingWizardProps = {
  user: { name: string; email: string };
  /** Shown after "Signed in as …", e.g. a "Switch account" button from the auth feature. */
  accountAction: ReactNode;
  /** Where the finish screen leads. */
  finishHref: string;
};

export function OnboardingWizard({ user, accountAction, finishHref }: OnboardingWizardProps) {
  const wizard = useOnboardingWizard({ name: user.name });
  const { step, stepIndex, stepCount, draft } = wizard;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(stepIndex);

  useEffect(() => {
    if (previousStep.current !== stepIndex) {
      previousStep.current = stepIndex;
      headingRef.current?.focus();
    }
  }, [stepIndex]);

  const selectedTasks = draft.tasks.filter((task) => task.selected).length;
  const primaryLabel = wizard.isBusy
    ? step.id === "focus"
      ? "Preparing your tasks…"
      : "Saving…"
    : step.id === "tasks"
      ? `Lock in ${selectedTasks} ${selectedTasks === 1 ? "task" : "tasks"}`
      : step.id === "reminders"
        ? "Finish setup"
        : "Continue";

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-4 sm:pt-[8vh]">
      <Card className="w-full max-w-xl">
        {wizard.isFinished ? (
          <CardContent>
            <OnboardingFinish href={finishHref} />
          </CardContent>
        ) : (
          <>
            <CardHeader className="grid grid-cols-[1fr_auto_1fr] items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Back"
                className={stepIndex === 0 ? "invisible" : undefined}
                disabled={stepIndex === 0 || wizard.isBusy}
                onClick={wizard.back}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <StepDots current={stepIndex} total={stepCount} />
              <div className="flex justify-end">
                {wizard.canSkip ? (
                  <Button type="button" variant="ghost" size="sm" onClick={wizard.skip}>
                    Skip
                  </Button>
                ) : null}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              <div className="space-y-1">
                <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
                  {step.title}
                </h1>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {step.id === "profile" ? (
                <ProfileStep
                  profile={draft.profile}
                  handleStatus={wizard.handleStatus}
                  onChange={wizard.updateProfile}
                />
              ) : null}
              {step.id === "startups" ? (
                <StartupsStep
                  startups={draft.startups}
                  onChange={(startups) => wizard.update("startups", startups)}
                />
              ) : null}
              {step.id === "github" ? (
                <GithubStep
                  login={draft.githubLogin}
                  handle={draft.profile.handle}
                  onChange={(login) => wizard.update("githubLogin", login)}
                />
              ) : null}
              {step.id === "situation" ? (
                <SituationStep
                  situation={draft.situation}
                  selectedSkills={draft.skills}
                  onSituationChange={(value) => wizard.update("situation", value)}
                  onSkillsChange={(value) => wizard.update("skills", value)}
                />
              ) : null}
              {step.id === "focus" ? (
                <FocusStep
                  focus={draft.focus}
                  onChange={(value) => wizard.update("focus", value)}
                />
              ) : null}
              {step.id === "tasks" ? (
                <TasksStep
                  tasks={draft.tasks}
                  onChange={(tasks) => wizard.update("tasks", tasks)}
                />
              ) : null}
              {step.id === "reminders" ? (
                <RemindersStep
                  reminderTime={draft.reminderTime}
                  timezone={draft.timezone}
                  consent={draft.consent}
                  onReminderTimeChange={(value) => wizard.update("reminderTime", value)}
                  onTimezoneChange={(value) => wizard.update("timezone", value)}
                  onConsentChange={(value) => wizard.update("consent", value)}
                />
              ) : null}

              {wizard.error ? (
                <Alert variant="destructive">
                  <CircleAlert aria-hidden="true" />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{wizard.error.message}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>

            <CardFooter>
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!wizard.canContinue || wizard.isBusy}
                onClick={wizard.next}
              >
                {primaryLabel}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      <p className="flex flex-wrap items-center justify-center gap-x-1 text-center text-sm text-muted-foreground">
        <span>
          Signed in as <span className="text-foreground">{user.email}</span>
        </span>
        <span aria-hidden="true">·</span>
        {accountAction}
      </p>
    </main>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="sr-only">
        Step {current + 1} of {total}
      </span>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={
            index === current
              ? "h-1.5 w-5 rounded-full bg-primary"
              : index < current
                ? "size-1.5 rounded-full bg-primary/40"
                : "size-1.5 rounded-full bg-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}
