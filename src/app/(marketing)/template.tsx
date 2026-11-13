import { ViewTransition, type ReactNode } from "react";

/**
 * Page transitions for the marketing site. A template (unlike a layout) remounts on every
 * navigation, so React pairs the old page's exit with the new page's enter. Every Next.js
 * navigation is a React transition, so this needs no client JavaScript of its own: React hands the
 * swap to the browser's View Transitions API, which animates snapshots on the compositor.
 * The animations (`page-exit`, `page-enter`) are in marketing.css. Browsers without support just
 * switch pages instantly. `default="none"` keeps unrelated transitions from animating the page.
 *
 * @packageDocumentation
 */

type MarketingTemplateProps = {
  children: ReactNode;
};

export default function MarketingTemplate({ children }: MarketingTemplateProps) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {/* One wrapper element, so the browser takes one snapshot per page instead of one per
          top-level section (fewer GPU textures, and off-screen sections are not captured alone). */}
      <div>{children}</div>
    </ViewTransition>
  );
}
