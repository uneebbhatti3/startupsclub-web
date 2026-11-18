"use client";

import { Camera, CircleCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { HandleStatus } from "@/features/onboarding/hooks/use-handle-availability";
import { onboardingLimits } from "@/features/onboarding/lib/onboarding-content";
import type { ProfileDraft } from "@/features/onboarding/types/onboarding-types";

/**
 * Step 1, "First, you": photo, name, handle (checked live), location and bio. The photo is only
 * previewed here; it is uploaded when onboarding completes.
 *
 * @packageDocumentation
 */

type ProfileStepProps = {
  profile: ProfileDraft;
  handleStatus: HandleStatus;
  onChange: <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => void;
};

function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return letters || "?";
}

export function ProfileStep({ profile, handleStatus, onChange }: ProfileStepProps) {
  const [photoError, setPhotoError] = useState<string | null>(null);
  const previewUrl = useMemo(
    () => (profile.photo ? URL.createObjectURL(profile.photo) : null),
    [profile.photo],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file.");
      return;
    }
    if (file.size > onboardingLimits.photoBytes) {
      setPhotoError("Choose an image under 2 MB.");
      return;
    }
    setPhotoError(null);
    onChange("photo", file);
  }

  const handleInvalid = handleStatus.state === "invalid" || handleStatus.state === "taken";

  return (
    <FieldGroup>
      <Field className="items-center">
        <label
          htmlFor="onboarding-photo"
          className="relative w-fit! cursor-pointer rounded-full focus-within:ring-3 focus-within:ring-ring/50"
        >
          <Avatar className="size-20">
            {previewUrl ? <AvatarImage src={previewUrl} alt="" /> : null}
            <AvatarFallback className="text-xl">{initials(profile.name)}</AvatarFallback>
          </Avatar>
          <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground">
            <Camera aria-hidden="true" className="size-3.5" />
          </span>
          <span className="sr-only">Choose a profile photo</span>
          <input
            id="onboarding-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPhotoChange}
          />
        </label>
        <FieldDescription className="text-center">
          {profile.photo ? "Tap to change photo" : "Tap to add a photo"}
        </FieldDescription>
        {photoError ? <FieldError className="text-center">{photoError}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="onboarding-name">Name</FieldLabel>
        <Input
          id="onboarding-name"
          autoComplete="name"
          maxLength={onboardingLimits.name}
          value={profile.name}
          onChange={(event) => onChange("name", event.target.value)}
          required
        />
      </Field>

      <Field data-invalid={handleInvalid ? true : undefined}>
        <FieldLabel htmlFor="onboarding-handle">Handle</FieldLabel>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-muted-foreground"
          >
            @
          </span>
          <Input
            id="onboarding-handle"
            className="pl-7"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={onboardingLimits.handleMax}
            value={profile.handle}
            onChange={(event) => onChange("handle", event.target.value.toLowerCase())}
            aria-invalid={handleInvalid ? true : undefined}
            aria-describedby="onboarding-handle-status"
            required
          />
        </div>
        <div id="onboarding-handle-status" aria-live="polite">
          <HandleMessage handle={profile.handle} status={handleStatus} />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="onboarding-location">Location</FieldLabel>
        <Input
          id="onboarding-location"
          autoComplete="address-level2"
          placeholder="Lahore, Pakistan"
          maxLength={onboardingLimits.location}
          value={profile.location}
          onChange={(event) => onChange("location", event.target.value)}
        />
      </Field>

      <Field>
        <div className="flex items-baseline justify-between">
          <FieldLabel htmlFor="onboarding-bio">Bio</FieldLabel>
          <span className="text-xs text-muted-foreground tabular-nums">
            {profile.bio.length}/{onboardingLimits.bio}
          </span>
        </div>
        <Textarea
          id="onboarding-bio"
          placeholder="What you build and what you are good at."
          maxLength={onboardingLimits.bio}
          value={profile.bio}
          onChange={(event) => onChange("bio", event.target.value)}
          className="min-h-20"
        />
      </Field>
    </FieldGroup>
  );
}

function HandleMessage({ handle, status }: { handle: string; status: HandleStatus }) {
  switch (status.state) {
    case "empty":
      return <FieldDescription>Your public profile address.</FieldDescription>;
    case "checking":
      return <FieldDescription>Checking @{handle}…</FieldDescription>;
    case "available":
      return (
        <FieldDescription className="flex items-center gap-1.5 text-primary-text">
          <CircleCheck aria-hidden="true" className="size-3.5" />@{handle} is yours.
        </FieldDescription>
      );
    case "taken":
      return <FieldError>@{handle} is taken. Try another.</FieldError>;
    case "invalid":
    case "error":
      return <FieldError>{status.message}</FieldError>;
  }
}
