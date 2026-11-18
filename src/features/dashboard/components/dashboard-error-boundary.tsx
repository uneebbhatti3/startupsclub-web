"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import { catchError } from "next/error";
import type { ErrorInfo } from "next/error";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the dashboard cards (Next.js `catchError`). The cards suspend on one shared
 * query, so one boundary around them shows a single message instead of the same error on every
 * card. "Retry" clears the failed query and renders the cards again, which refetches.
 *
 * Reporting to Sentry belongs here once `@sentry/nextjs` is installed (docs/MONITORING.md).
 *
 * @packageDocumentation
 */

function DashboardErrorFallback(_props: object, { reset }: ErrorInfo) {
  return <DashboardErrorMessage onRetry={reset} />;
}

function DashboardErrorMessage({ onRetry }: { onRetry: () => void }) {
  const queryReset = useQueryErrorResetBoundary();

  return (
    <Alert variant="destructive">
      <AlertTitle>Could not load your dashboard</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <p>Check your connection and try again.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            queryReset.reset();
            onRetry();
          }}
        >
          <RotateCw />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export const DashboardErrorBoundary = catchError(DashboardErrorFallback);
