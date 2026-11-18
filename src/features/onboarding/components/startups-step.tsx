"use client";

import { Plus, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStartupLookup } from "@/features/onboarding/hooks/use-onboarding-actions";
import { blankStartup } from "@/features/onboarding/hooks/use-onboarding-wizard";
import { onboardingLimits } from "@/features/onboarding/lib/onboarding-content";
import type { StartupDraft } from "@/features/onboarding/types/onboarding-types";

/**
 * Step 2, "Your startups": one card per startup with landing page, name and tagline. Leaving the
 * landing page field fills an empty name from the page (fixture lookup). Up to five startups; the
 * step can be skipped.
 *
 * @packageDocumentation
 */

type StartupsStepProps = {
  startups: StartupDraft[];
  onChange: (startups: StartupDraft[]) => void;
};

export function StartupsStep({ startups, onChange }: StartupsStepProps) {
  function updateStartup(id: string, patch: Partial<StartupDraft>) {
    onChange(startups.map((startup) => (startup.id === id ? { ...startup, ...patch } : startup)));
  }

  return (
    <div className="flex flex-col gap-4">
      {startups.map((startup, index) => (
        <StartupFields
          key={startup.id}
          startup={startup}
          index={index}
          onChange={(patch) => updateStartup(startup.id, patch)}
          onRemove={() => onChange(startups.filter((item) => item.id !== startup.id))}
        />
      ))}
      {startups.length < onboardingLimits.startups ? (
        <Button
          type="button"
          variant="ghost"
          className="self-start"
          onClick={() => onChange([...startups, blankStartup()])}
        >
          <Plus aria-hidden="true" />
          {startups.length === 0 ? "Add a startup" : "Add another"}
        </Button>
      ) : null}
    </div>
  );
}

type StartupFieldsProps = {
  startup: StartupDraft;
  index: number;
  onChange: (patch: Partial<StartupDraft>) => void;
  onRemove: () => void;
};

/** Adds `https://` when the member typed a bare domain, and rejects anything that is not a URL. */
function toUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

function StartupFields({ startup, index, onChange, onRemove }: StartupFieldsProps) {
  const lookup = useStartupLookup();
  const prefix = `onboarding-startup-${startup.id}`;
  const number = index + 1;

  function onUrlBlur() {
    const url = toUrl(startup.url);
    if (!url || startup.name.trim()) {
      return;
    }
    lookup.mutate(url, {
      onSuccess: (details) =>
        onChange({ name: details.name, tagline: startup.tagline || details.tagline }),
    });
  }

  return (
    <fieldset className="relative rounded-lg border p-4">
      <legend className="sr-only">Startup {number}</legend>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2"
        aria-label={`Remove startup ${number}`}
        onClick={onRemove}
      >
        <X aria-hidden="true" />
      </Button>
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor={`${prefix}-url`}>Landing page</FieldLabel>
          <Input
            id={`${prefix}-url`}
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="yourapp.com"
            value={startup.url}
            onChange={(event) => onChange({ url: event.target.value })}
            onBlur={onUrlBlur}
          />
          <FieldDescription aria-live="polite">
            {lookup.isPending
              ? "Reading the page…"
              : "Paste your landing page and the name fills in."}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${prefix}-name`}>Name</FieldLabel>
          <div className="flex items-center gap-2">
            <Avatar className="size-9 rounded-md after:rounded-md">
              <AvatarFallback className="rounded-md">
                {startup.name.trim().charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <Input
              id={`${prefix}-name`}
              placeholder="e.g. LaunchPilot"
              maxLength={onboardingLimits.startupName}
              value={startup.name}
              onChange={(event) => onChange({ name: event.target.value })}
              required
            />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${prefix}-tagline`}>Tagline (optional)</FieldLabel>
          <Input
            id={`${prefix}-tagline`}
            placeholder="One line on what it does"
            maxLength={onboardingLimits.tagline}
            value={startup.tagline}
            onChange={(event) => onChange({ tagline: event.target.value })}
          />
        </Field>
      </FieldGroup>
    </fieldset>
  );
}
