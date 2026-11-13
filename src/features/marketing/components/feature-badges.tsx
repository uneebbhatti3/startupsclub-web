import type { Feature } from "@/features/marketing/lib/content/features";
import { cn } from "@/lib/utils";

/**
 * Plan badge for a feature: "Pro" for Pro-only features, "Free and Pro" for everything else.
 * Pro uses the solid blue tint, Free and Pro a quiet neutral pill, and the text itself always
 * states the plan, so the meaning never relies on colour.
 *
 * @packageDocumentation
 */

type PlanBadgeProps = {
  plan: Feature["plan"];
  className?: string;
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        plan === "pro"
          ? "bg-accent text-primary-text"
          : "border border-border text-muted-foreground",
        className,
      )}
    >
      {plan === "pro" ? "Pro" : "Free and Pro"}
    </span>
  );
}
