"use client";

import { CircleAlert, CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWaitlistForm } from "@/features/waitlist/hooks/use-waitlist-form";
import { waitlistLimits, waitlistPage } from "@/features/waitlist/lib/waitlist-content";

/**
 * Waitlist form (name, email and role), built only from shadcn components. All state and the API
 * call live in `useWaitlistForm`; this component only renders. While sending, the button is
 * disabled and says "Joining…". On success the card shows a confirmation instead of the form;
 * on failure a destructive Alert explains why and rejected fields are marked, keeping what the
 * user typed.
 *
 * @packageDocumentation
 */

export function WaitlistForm() {
  const { fields, roles, success } = waitlistPage;
  const { formData, onChange, onRoleChange, onSubmit, isPending, formError, joinedEmail } =
    useWaitlistForm();
  const fieldErrors = formError?.fields ?? {};

  if (joinedEmail) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent role="status" className="flex flex-col items-center gap-3 py-6 text-center">
          <CircleCheck aria-hidden="true" className="size-10 text-primary-text" />
          <h2 className="font-heading text-2xl font-semibold">{success.title}</h2>
          <p className="text-muted-foreground">
            {success.descriptionBefore}
            <span className="font-medium text-foreground">{joinedEmail}</span>
            {success.descriptionAfter}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={fieldErrors.name ? true : undefined}>
                <FieldLabel htmlFor="waitlist-name">{fields.name}</FieldLabel>
                <Input
                  id="waitlist-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  maxLength={waitlistLimits.name}
                  value={formData.name}
                  onChange={onChange}
                  aria-invalid={fieldErrors.name ? true : undefined}
                  required
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>
              <Field data-invalid={fieldErrors.email ? true : undefined}>
                <FieldLabel htmlFor="waitlist-email">{fields.email}</FieldLabel>
                <Input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="johndoe@example.com"
                  maxLength={waitlistLimits.email}
                  value={formData.email}
                  onChange={onChange}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  required
                />
                <FieldError>{fieldErrors.email}</FieldError>
              </Field>
              <Field data-invalid={fieldErrors.role ? true : undefined}>
                <FieldLabel htmlFor="waitlist-role">{fields.role}</FieldLabel>
                {/* `items` lets the trigger show the label ("Founder") instead of the value. */}
                <Select
                  name="role"
                  required
                  items={roles}
                  value={formData.role === "" ? null : formData.role}
                  onValueChange={onRoleChange}
                >
                  {/* text-base below md matches Input, so mobile browsers do not zoom on focus. */}
                  <SelectTrigger
                    id="waitlist-role"
                    className="w-full text-base md:text-sm"
                    aria-invalid={fieldErrors.role ? true : undefined}
                  >
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
                <FieldError>{fieldErrors.role}</FieldError>
              </Field>
              {formData.role === "other" ? (
                <Field data-invalid={fieldErrors.roleOther ? true : undefined}>
                  <FieldLabel htmlFor="waitlist-other-role">{fields.otherRole}</FieldLabel>
                  <Input
                    id="waitlist-other-role"
                    name="roleOther"
                    type="text"
                    autoComplete="organization-title"
                    placeholder={fields.otherRolePlaceholder}
                    maxLength={waitlistLimits.roleOther}
                    value={formData.roleOther}
                    onChange={onChange}
                    aria-invalid={fieldErrors.roleOther ? true : undefined}
                    required
                  />
                  <FieldError>{fieldErrors.roleOther}</FieldError>
                </Field>
              ) : null}
              {formError ? (
                <Alert variant="destructive">
                  <CircleAlert aria-hidden="true" />
                  <AlertTitle>{waitlistPage.errorTitle}</AlertTitle>
                  <AlertDescription>{formError.message}</AlertDescription>
                </Alert>
              ) : null}
              <Field>
                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? waitlistPage.submitting : waitlistPage.submit}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
