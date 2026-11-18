"use client";

import { use, useState } from "react";
import type { FormEvent } from "react";
import { browser } from "react-dom";

import useFormHandler from "@/hooks/use-form-handler";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthAlert } from "@/features/auth/components/auth-alert";
import { useResendVerification } from "@/features/auth/hooks/use-resend-verification";
import { readPendingVerificationEmail } from "@/features/auth/lib/pending-verification";

/**
 * The body of `/verify-email`. When this tab remembers the address (after sign-up, or a log-in
 * before verifying), it names it and offers "Resend link". Otherwise (a new tab, storage blocked)
 * it asks for the address first. Renders only in the browser (`use(browser())`) because the
 * address lives in `sessionStorage`; the page wraps it in `Suspense` with a fallback.
 *
 * @packageDocumentation
 */

type ResendFormData = { email: string };

export function ResendVerificationForm() {
  use(browser("The email waiting for verification is kept in sessionStorage."));
  const [savedEmail] = useState(readPendingVerificationEmail);
  const { formData, onChange } = useFormHandler<ResendFormData>({ email: savedEmail });
  const resend = useResendVerification();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resend.mutate(formData.email.trim());
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup>
          {savedEmail ? (
            <p className="text-muted-foreground">
              We sent a verification link to{" "}
              <span className="font-medium wrap-break-word text-foreground">{savedEmail}</span>. It
              expires in 1 hour. If you cannot find it, check your spam folder.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground">
                Enter the email you signed up with and we will send a new verification link.
              </p>
              <Field>
                <FieldLabel htmlFor="verify-email">Email</FieldLabel>
                <Input
                  id="verify-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </Field>
            </>
          )}
          {resend.isSuccess ? (
            <AuthAlert
              tone="success"
              title="New link sent"
              message="Check your inbox. Only the newest link works."
            />
          ) : null}
          {resend.error ? (
            <AuthAlert
              tone="error"
              title="Could not send the link"
              message={resend.error.message}
            />
          ) : null}
          <Field>
            <Button
              type="submit"
              variant={savedEmail ? "outline" : "default"}
              size="lg"
              className="w-full"
              disabled={resend.isPending}
            >
              {resend.isPending ? "Sending…" : savedEmail ? "Resend link" : "Send link"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
