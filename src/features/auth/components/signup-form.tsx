"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import useFormHandler from "@/hooks/use-form-handler";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthAlert } from "@/features/auth/components/auth-alert";
import { GithubSignInButton } from "@/features/auth/components/github-sign-in-button";
import { useRedirectIfSignedIn } from "@/features/auth/hooks/use-redirect-if-signed-in";
import { useSignUp } from "@/features/auth/hooks/use-sign-up";
import { passwordLimits } from "@/features/auth/lib/auth-config";
import { savePendingVerificationEmail } from "@/features/auth/lib/pending-verification";
import type { SignUpRequest } from "@/features/auth/types/auth-types";

/**
 * Sign-up form: GitHub, then name, email and password through better-auth. The backend sends a
 * verification email and creates no session, so success goes to `/verify-email` (the address is
 * kept in this tab's `sessionStorage` for "Resend link"). Failures are shown above the button and
 * keep what the user typed. A visitor who is already signed in is redirected.
 *
 * @packageDocumentation
 */

export function SignupForm() {
  const router = useRouter();
  useRedirectIfSignedIn();
  const { formData, onChange } = useFormHandler<SignUpRequest>({
    name: "",
    email: "",
    password: "",
  });

  const signUp = useSignUp({
    onSuccess: (_result, request) => {
      savePendingVerificationEmail(request.email);
      router.push("/verify-email");
    },
  });
  // Stays disabled while the browser moves to /verify-email.
  const isBusy = signUp.isPending || signUp.isSuccess;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signUp.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup>
          <GithubSignInButton />
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="signup-name">Name</FieldLabel>
            <Input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={onChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={onChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <Input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={passwordLimits.min}
              maxLength={passwordLimits.max}
              aria-describedby="signup-password-hint"
              value={formData.password}
              onChange={onChange}
              required
            />
            <FieldDescription id="signup-password-hint">
              At least {passwordLimits.min} characters.
            </FieldDescription>
          </Field>
          {signUp.error ? (
            <AuthAlert
              tone="error"
              title="Could not create your account"
              message={signUp.error.message}
            />
          ) : null}
          <Field>
            <Button type="submit" size="lg" className="w-full" disabled={isBusy}>
              {isBusy ? "Creating account…" : "Create account"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
