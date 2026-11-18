import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Error state for `/onboarding` when the session could not be checked (API down or asleep):
 * a plain sentence and one "Try again" action (DESIGN_SYSTEM section 6).
 *
 * @packageDocumentation
 */

type OnboardingLoadErrorProps = {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
};

export function OnboardingLoadError({ message, onRetry, isRetrying }: OnboardingLoadErrorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:pt-[8vh]">
      <Card className="w-full max-w-xl">
        <CardContent role="alert" className="flex flex-col items-center gap-4 py-6 text-center">
          <h1 className="text-2xl font-semibold">We could not load your account</h1>
          <p className="text-muted-foreground">{message}</p>
          <Button type="button" onClick={onRetry} disabled={isRetrying}>
            {isRetrying ? "Trying again…" : "Try again"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
