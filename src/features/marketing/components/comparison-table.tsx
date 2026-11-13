import { Check, Minus } from "lucide-react";

import type { FeatureGroup, PlanCell } from "@/features/marketing/lib/content/features";
import { cn } from "@/lib/utils";

/**
 * Free vs Pro comparison table, built entirely from `featureGroups` (no hard-coded rows).
 * A real table: hidden caption, column headers, one `<tbody>` per group with a row-group header,
 * and each feature as a row header with its one-line summary. Included / not included cells pair
 * an icon with visually hidden text, so meaning never depends on colour or the icon alone.
 *
 * Small screens: the table scrolls sideways inside its own focusable, labelled container, so the
 * page never scrolls sideways. From `md` up the container does not clip, because any overflow
 * ancestor would stop the header row from pinning below the site header while the table scrolls.
 *
 * @packageDocumentation
 */

const captionId = "plan-comparison-caption";

function Cell({ value }: { value: PlanCell }) {
  if (value === true) {
    return (
      <>
        <Check aria-hidden="true" className="mx-auto size-5 text-primary-text" strokeWidth={2.5} />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-sm font-medium">{value}</span>;
}

type ComparisonTableProps = {
  groups: FeatureGroup[];
};

export function ComparisonTable({ groups }: ComparisonTableProps) {
  return (
    <div
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      className="-mx-6 overflow-x-auto px-6 focus-visible:rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:mx-0 md:overflow-visible md:px-0"
    >
      <table className="w-full min-w-[20rem] border-separate border-spacing-0 text-left">
        <caption id={captionId} className="sr-only">
          Free and Pro plans compared, feature by feature
        </caption>
        <colgroup>
          <col />
          <col className="w-[5.5rem] sm:w-36" />
          <col className="w-[5.5rem] sm:w-36" />
        </colgroup>
        <thead>
          <tr>
            {(["Feature", "Free", "Pro"] as const).map((label) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  // Solid background, plus an upward shadow in the page colour that fills the
                  // gap under the floating site header, so rows never show through while pinned.
                  "border-b border-border bg-background px-1.5 py-4 text-sm font-semibold sm:px-3 md:sticky md:top-[76px] md:z-10 md:shadow-[0_-8px_0_var(--background)]",
                  label === "Feature" ? "pl-0 sm:pl-0" : "text-center",
                  label === "Pro" && "text-primary-text",
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.id}>
            <tr>
              <th
                scope="rowgroup"
                colSpan={3}
                className="border-b border-border pt-10 pb-3 font-heading text-base font-semibold tracking-tight"
              >
                {group.name}
              </th>
            </tr>
            {group.features.map((feature) => (
              <tr key={feature.id}>
                <th
                  scope="row"
                  className="border-b border-border py-4 pr-3 align-top text-[15px] font-medium"
                >
                  {feature.name}
                  <span className="mt-1 block text-sm leading-snug font-normal text-muted-foreground">
                    {feature.summary}
                  </span>
                </th>
                <td className="border-b border-border px-1.5 py-4 text-center align-middle sm:px-3">
                  <Cell value={feature.free} />
                </td>
                <td className="border-b border-border px-1.5 py-4 text-center align-middle sm:px-3">
                  <Cell value={feature.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
