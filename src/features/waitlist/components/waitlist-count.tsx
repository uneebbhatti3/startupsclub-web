"use client";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { useWaitlistCount } from "@/features/waitlist/hooks/use-waitlist-count";
import { waitlistCount } from "@/features/waitlist/lib/waitlist-content";

/**
 * "123+ people waiting" with a shadcn AvatarGroup, shown above the waitlist form. Starts from the
 * server-cached count passed in by the page, so it shows on load (D35). Renders nothing only if
 * that count was unavailable and the browser request is still loading or failed, or while the
 * count is 0 (owner's choice), so the page never shows a placeholder or an error for it.
 *
 * @packageDocumentation
 */

const numberFormat = new Intl.NumberFormat("en-US");

type WaitlistCountProps = {
  /** Server-cached count, or `null` if the API could not be reached when the page was built. */
  initialCount: number | null;
};

export function WaitlistCount({ initialCount }: WaitlistCountProps) {
  const count = useWaitlistCount(initialCount);

  if (count === null || count <= 0) {
    return null;
  }

  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <AvatarGroup aria-hidden="true">
        {waitlistCount.avatars.map((avatar) => (
          <Avatar key={avatar.src}>
            <AvatarImage src={avatar.src} alt="" />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{numberFormat.format(count)}</span>
        {waitlistCount.suffix}
      </p>
    </div>
  );
}
