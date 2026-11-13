import Link from "next/link";

import type { FeatureGroup } from "@/features/marketing/lib/content/features";

/**
 * Sticky in-page navigation for the Features page: one plain anchor link per feature group.
 * It sits just below the sticky site header and scrolls sideways on narrow screens. Plain links
 * need no client JavaScript; each target section has a scroll margin so its heading lands below
 * the header and this bar.
 *
 * @packageDocumentation
 */

type FeatureGroupNavProps = {
  groups: FeatureGroup[];
};

export function FeatureGroupNav({ groups }: FeatureGroupNavProps) {
  return (
    <nav
      aria-label="Feature groups"
      className="sticky top-[76px] z-40 border-y border-border bg-background/85 backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-6xl [scrollbar-width:none] gap-1 overflow-x-auto px-4 py-2 sm:justify-center sm:px-6">
        {groups.map((group) => (
          <li key={group.id} className="flex-none">
            <Link
              href={`#${group.id}`}
              className="inline-flex min-h-9 items-center rounded-full px-3.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
