import { useSyncExternalStore } from "react";

/**
 * `useIsMobile`: true when the viewport is narrower than the mobile breakpoint (768px). Used by
 * the shadcn sidebar to switch to its sheet layout. Subscribes to a media query through
 * `useSyncExternalStore` instead of setting state in an effect, and reports `false` during server
 * rendering and hydration, as the original shadcn hook did.
 *
 * @packageDocumentation
 */

const MOBILE_BREAKPOINT = 768;
const mobileQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(mobileQuery);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(mobileQuery).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
