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
import { Toggle } from "@/components/ui/toggle";
import { situations, skills } from "@/features/onboarding/lib/onboarding-content";
import type { SituationValue, SkillValue } from "@/features/onboarding/types/onboarding-types";

/**
 * Step 4, "Your current situation": one situation (shadcn choice cards) and any number of skills
 * (toggle chips). Both stay private.
 *
 * @packageDocumentation
 */

type SituationStepProps = {
  situation: SituationValue | null;
  selectedSkills: SkillValue[];
  onSituationChange: (value: SituationValue) => void;
  onSkillsChange: (value: SkillValue[]) => void;
};

function isSituation(value: unknown): value is SituationValue {
  return situations.some((option) => option.value === value);
}

export function SituationStep({
  situation,
  selectedSkills,
  onSituationChange,
  onSkillsChange,
}: SituationStepProps) {
  function toggleSkill(skill: SkillValue, pressed: boolean) {
    onSkillsChange(
      pressed ? [...selectedSkills, skill] : selectedSkills.filter((item) => item !== skill),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend className="sr-only">Situation</FieldLegend>
        <RadioGroup
          value={situation}
          onValueChange={(value) => {
            if (isSituation(value)) {
              onSituationChange(value);
            }
          }}
          className="gap-2"
        >
          {situations.map((option) => (
            <FieldLabel key={option.value} htmlFor={`situation-${option.value}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{option.title}</FieldTitle>
                  <FieldDescription>{option.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={option.value} id={`situation-${option.value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Your skills (pick any)</FieldLegend>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Toggle
              key={skill.value}
              variant="outline"
              size="sm"
              className="rounded-full px-3 aria-pressed:border-primary/40 aria-pressed:bg-primary/10 aria-pressed:text-primary-text"
              pressed={selectedSkills.includes(skill.value)}
              onPressedChange={(pressed) => toggleSkill(skill.value, pressed)}
            >
              {skill.label}
            </Toggle>
          ))}
        </div>
      </FieldSet>
    </div>
  );
}
