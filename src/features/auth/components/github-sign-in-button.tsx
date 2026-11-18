"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { AuthAlert } from "@/features/auth/components/auth-alert";
import { GitHubMark } from "@/components/shared/github-mark";
import { useGithubSignIn } from "@/features/auth/hooks/use-github-sign-in";

/**
 * "Continue with GitHub" for both `/login` and `/signup` (GitHub sign-up and sign-in are the same
 * call). It stays disabled from the click until the browser has left for GitHub. If the request
 * for GitHub's URL fails, the reason is shown under the button.
 *
 * @packageDocumentation
 */

export function GithubSignInButton() {
  const github = useGithubSignIn();
  const isBusy = github.isPending || github.isSuccess;

  return (
    <Field>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={isBusy}
        onClick={() => github.mutate()}
      >
        <GitHubMark aria-hidden="true" />
        {isBusy ? "Opening GitHub…" : "Continue with GitHub"}
      </Button>
      {github.error ? (
        <AuthAlert
          tone="error"
          title="Could not start GitHub sign-in"
          message={github.error.message}
        />
      ) : null}
    </Field>
  );
}
