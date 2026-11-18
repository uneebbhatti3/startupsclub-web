import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for `/onboarding` while the session is checked: the wizard card's outline in
 * skeletons, so the layout does not jump when the first step appears.
 *
 * @packageDocumentation
 */

export function OnboardingSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:pt-[8vh]">
      <Card className="w-full max-w-xl" aria-busy="true" aria-label="Loading onboarding">
        <CardContent className="flex flex-col gap-6">
          <Skeleton className="mx-auto h-2 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="mx-auto size-20 rounded-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </main>
  );
}
