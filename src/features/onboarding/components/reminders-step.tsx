"use client";

import { useMemo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Step 7, "Reminders and privacy": the daily reminder time, the timezone (defaults to the
 * browser's) and the required privacy consent (FR-ONB-2).
 *
 * @packageDocumentation
 */

type RemindersStepProps = {
  reminderTime: string;
  timezone: string;
  consent: boolean;
  onReminderTimeChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
  onConsentChange: (value: boolean) => void;
};

function listTimezones(current: string): string[] {
  const zones = Intl.supportedValuesOf("timeZone");
  return zones.includes(current) ? zones : [current, ...zones];
}

export function RemindersStep({
  reminderTime,
  timezone,
  consent,
  onReminderTimeChange,
  onTimezoneChange,
  onConsentChange,
}: RemindersStepProps) {
  const timezones = useMemo(
    () => listTimezones(timezone).map((zone) => ({ value: zone, label: zone.replace(/_/g, " ") })),
    [timezone],
  );

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="onboarding-reminder-time">Daily standup reminder</FieldLabel>
        <Input
          id="onboarding-reminder-time"
          type="time"
          value={reminderTime}
          onChange={(event) => onReminderTimeChange(event.target.value)}
          required
        />
        <FieldDescription>We remind you once a day if you have not posted yet.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="onboarding-timezone">Timezone</FieldLabel>
        <Select
          items={timezones}
          value={timezone}
          onValueChange={(value) => {
            if (typeof value === "string") {
              onTimezoneChange(value);
            }
          }}
        >
          {/* text-base below md matches Input, so mobile browsers do not zoom on focus. */}
          <SelectTrigger id="onboarding-timezone" className="w-full text-base md:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((zone) => (
              <SelectItem key={zone.value} value={zone.value}>
                {zone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          Your &quot;today&quot; for standups follows this timezone.
        </FieldDescription>
      </Field>

      <Field orientation="horizontal">
        <Checkbox
          id="onboarding-consent"
          checked={consent}
          onCheckedChange={(checked) => onConsentChange(checked)}
          required
        />
        <FieldContent>
          <FieldLabel htmlFor="onboarding-consent">
            I agree that StartupsClub stores my profile, startups and tasks to run my account.
          </FieldLabel>
          <FieldDescription>
            Your situation and skills stay private. Your profile, startups and streak are visible to
            other members.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
