import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * Site-wide 404 screen for unmatched URLs. Plain sentence and one action, per the error-screen
 * rules in docs/DESIGN_SYSTEM.md. Next.js returns HTTP 404 and adds a noindex robots tag.
 *
 * @packageDocumentation
 */

export const metadata: Metadata = {
  title: "Page not found",
  // Next.js adds its own noindex to 404s, but without this the root layout's production
  // "index, follow" is also emitted, giving crawlers two conflicting robots tags.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-24 text-foreground">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
