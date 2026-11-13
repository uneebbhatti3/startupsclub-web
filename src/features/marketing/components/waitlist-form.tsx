"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { waitlistPage } from "@/features/marketing/lib/content/waitlist";

/**
 * Waitlist form (name and email), built only from shadcn components. The fields are open and the
 * browser validates them (both required, email format).
 *
 * Where entries are stored is not decided yet (docs/DECISIONS.md D27), so `handleSubmit` does not
 * send them anywhere. It still prevents the default submit, which would otherwise put the name and
 * email into the page URL (and from there into history, logs and error reports). Send the entry
 * from here once storage is decided (a service in `services/` and a TanStack Query mutation hook).
 *
 * @packageDocumentation
 */

export function WaitlistForm() {
  const { fields } = waitlistPage;

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
