"use client";

import { CircleCheck } from "lucide-react";

import { GitHubMark } from "@/components/shared/github-mark";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { useConnectGithub } from "@/features/onboarding/hooks/use-onboarding-actions";

/**
 * Step 3, "Connect GitHub" (optional). Shows the connected account with a "Disconnect" action, or
 * a "Connect GitHub" button. The connection is a fixture until account linking is confirmed.
 *
 * @packageDocumentation
 */

type GithubStepProps = {
  login: string | null;
  handle: string;
  onChange: (login: string | null) => void;
};

export function GithubStep({ login, handle, onChange }: GithubStepProps) {
  const connect = useConnectGithub();

  if (login) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm dark:border-primary/20 dark:bg-primary/10">
        <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-primary-text" />
        <p className="flex-1">
          Connected as <span className="font-medium">@{login}</span>
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={connect.isPending}
        onClick={() => connect.mutate(handle, { onSuccess: (account) => onChange(account.login) })}
      >
        <GitHubMark aria-hidden="true" />
        {connect.isPending ? "Connecting…" : "Connect GitHub"}
      </Button>
      {connect.error ? <FieldError>{connect.error.message}</FieldError> : null}
    </div>
  );
}
