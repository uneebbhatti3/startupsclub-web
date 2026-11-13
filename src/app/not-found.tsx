import { ArrowRight, House } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Site-wide 404 screen for unmatched URLs: a large "404", one plain sentence, the way home and a
 * few real pages to try instead. It serves every route group (marketing now, the app later), so it
 * uses only design tokens and shared components, never marketing-only CSS or animation code.
 * Next.js returns HTTP 404; the robots metadata below keeps it out of search results.
 *
 * @packageDocumentation
 */

export const metadata: Metadata = {
  title: "Page not found",
  // Next.js adds its own noindex to 404s, but without this the root layout's production
  // "index, follow" is also emitted, giving crawlers two conflicting robots tags.
  robots: { index: false, follow: true },
};

/** Existing public pages only; add more as they are built. */
const suggestions = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
] as const;

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-svh flex-1 flex-col overflow-hidden bg-background text-foreground">
      {/* Same blue wash and dotted grid as the marketing hero, drawn with tokens only. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_0%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_72%)] dark:bg-[radial-gradient(55%_45%_at_50%_0%,color-mix(in_srgb,var(--primary)_26%,transparent),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_srgb,var(--foreground)_14%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,white_20%,transparent_75%)] bg-size-[22px_22px]"
      />

      <header className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Link
          href="/"
          aria-label="StartupsClub home"
          className="inline-flex rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex max-w-xl flex-col items-center text-center">
          <p
            aria-hidden="true"
            className="bg-linear-to-b from-foreground/85 to-foreground/5 bg-clip-text font-heading text-[8.5rem] leading-none font-semibold tracking-[-0.06em] text-transparent select-none sm:text-[12rem]"
          >
            404
          </p>

          <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Error 404
          </p>

          <h1 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            The page you are looking for does not exist or has moved.
          </p>

          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-9 h-11 rounded-full px-6 text-sm font-semibold",
            )}
          >
            <House aria-hidden="true" />
            Go to the home page
          </Link>

          <nav aria-label="Suggested pages" className="mt-10 w-full">
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="group inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-background/70 px-4 text-sm font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {page.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </div>
  );
}
