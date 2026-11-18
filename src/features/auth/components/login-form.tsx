"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import type { FormEvent } from "react";

import useFormHandler from "@/hooks/use-form-handler";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthAlert } from "@/features/auth/components/auth-alert";
import { GithubErrorAlert } from "@/features/auth/components/github-error-alert";
import { GithubSignInButton } from "@/features/auth/components/github-sign-in-button";
import { useRedirectIfSignedIn } from "@/features/auth/hooks/use-redirect-if-signed-in";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";
import { afterSignInPath, authErrorCodes, passwordLimits } from "@/features/auth/lib/auth-config";
import { savePendingVerificationEmail } from "@/features/auth/lib/pending-verification";
import type { SignInRequest } from "@/features/auth/types/auth-types";

/**
 * Log-in form: GitHub, then email and password through better-auth. Success goes to the
 * post-sign-in page. An unverified email (403 `EMAIL_NOT_VERIFIED`; the backend has just sent a
 * new link) goes to `/verify-email`. Any other failure, such as a wrong password, is shown above
 * the button and keeps what the user typed. A visitor who is already signed in is redirected.
 *
 * @packageDocumentation
 */

export function LoginForm() {
  const router = useRouter();
  useRedirectIfSignedIn();
  const { formData, onChange } = useFormHandler<SignInRequest>({ email: "", password: "" });

  const signIn = useSignIn({
    onSuccess: () => router.replace(afterSignInPath),
    onError: (error, request) => {
      if (error.code === authErrorCodes.emailNotVerified) {
        savePendingVerificationEmail(request.email);
        router.push("/verify-email");
      }
    },
  });
  const isUnverified = signIn.error?.code === authErrorCodes.emailNotVerified;
  // Stays disabled while the browser moves to the next page.
  const isBusy = signIn.isPending || signIn.isSuccess || isUnverified;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn.mutate({ email: formData.email.trim(), password: formData.password });
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup>
          <Suspense fallback={null}>
            <GithubErrorAlert />
          </Suspense>
          <GithubSignInButton />
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
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
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={passwordLimits.max}
              value={formData.password}
              onChange={onChange}
              required
            />
          </Field>
          {signIn.error && !isUnverified ? (
            <AuthAlert tone="error" title="Could not log in" message={signIn.error.message} />
          ) : null}
          <Field>
            <Button type="submit" size="lg" className="w-full" disabled={isBusy}>
              {isBusy ? "Logging in…" : "Log in"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
