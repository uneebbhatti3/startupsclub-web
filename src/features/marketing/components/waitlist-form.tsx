"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { waitlistPage } from "@/features/marketing/lib/content/waitlist";

/**
 * Waitlist form (name, email and role), built only from shadcn components (Field, Input, Select,
 * Button). Every field is required and validated by the browser. Choosing "Other" reveals a
 * required free-text role field; it is removed again (and its value dropped) for any other role.
 *
 * Where entries are stored is not decided yet (docs/DECISIONS.md D27), so `handleSubmit` does not
 * send them anywhere. It still prevents the default submit, which would otherwise put the name and
 * email into the page URL (and from there into history, logs and error reports). Send the entry
 * from here once storage is decided (a service in `services/` and a TanStack Query mutation hook).
 *
 * @packageDocumentation
 */

export function WaitlistForm() {
  const { fields, roles } = waitlistPage;
  const [role, setRole] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="waitlist-name">{fields.name}</FieldLabel>
                <Input
                  id="waitlist-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="waitlist-email">{fields.email}</FieldLabel>
                <Input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="johndoe@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="waitlist-role">{fields.role}</FieldLabel>
                {/* `items` lets the trigger show the label ("Founder") instead of the value. */}
                <Select name="role" required items={roles} value={role} onValueChange={setRole}>
                  {/* text-base below md matches Input, so mobile browsers do not zoom on focus. */}
                  <SelectTrigger id="waitlist-role" className="w-full text-base md:text-sm">
                    <SelectValue placeholder={fields.rolePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {role === "other" ? (
                <Field>
                  <FieldLabel htmlFor="waitlist-other-role">{fields.otherRole}</FieldLabel>
                  <Input
                    id="waitlist-other-role"
                    name="otherRole"
                    type="text"
                    autoComplete="organization-title"
                    placeholder={fields.otherRolePlaceholder}
                    required
                  />
                </Field>
              ) : null}
              <Field>
                <Button type="submit" size="lg" className="w-full">
                  {waitlistPage.submit}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
