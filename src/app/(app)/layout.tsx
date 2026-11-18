import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/app/(app)/app-shell";

/**
 * Layout for the signed-in app (`(app)` route group): the sidebar and header shell with the
 * sign-in guard. App pages are private, so they are `noindex` and stay out of the sitemap (D4).
 *
 * @packageDocumentation
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
