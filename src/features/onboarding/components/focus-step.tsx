"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { focuses } from "@/features/onboarding/lib/onboarding-content";
import type { FocusValue } from "@/features/onboarding/types/onboarding-types";

/**
 * Step 5, "What is your focus right now?": one goal as shadcn choice cards with a Lucide line
 * icon each. The choice seeds the suggested first tasks.
 *
 * @packageDocumentation
 */

type FocusStepProps = {
  focus: FocusValue | null;
  onChange: (value: FocusValue) => void;
};

function isFocus(value: unknown): value is FocusValue {
  return focuses.some((option) => option.value === value);
}

export function FocusStep({ focus, onChange }: FocusStepProps) {
  return (
    <FieldSet>
      <FieldLegend className="sr-only">Focus</FieldLegend>
      <RadioGroup
        value={focus}
        onValueChange={(value) => {
          if (isFocus(value)) {
            onChange(value);
          }
        }}
        className="gap-2"
      >
        {focuses.map((option) => {
          const Icon = option.icon;
          return (
            <FieldLabel key={option.value} htmlFor={`focus-${option.value}`}>
              <Field orientation="horizontal" className="items-center!">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <FieldContent>
                  <FieldTitle>{option.title}</FieldTitle>
                  <FieldDescription>{option.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={option.value} id={`focus-${option.value}`} />
              </Field>
            </FieldLabel>
          );
        })}
      </RadioGroup>
    </FieldSet>
  );
}
