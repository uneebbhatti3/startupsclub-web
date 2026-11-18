import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

/**
 * Shared layout for the log-in and sign-up screens, adapted from a 21st.dev auth-page template.
 * Two columns on large screens: a muted brand panel (logo, the home hero message, static
 * decorative lines) and the page's heading, form and a link to the other auth page. The
 * decorative lines are static because the app tier allows no page animations (DESIGN_SYSTEM
 * section 9). This stays a server component; only the forms are client components.
 *
 * @packageDocumentation
 */

type AuthShellProps = {
  /** Page heading (the only h1). */
  title: string;
  /** One sentence under the heading. */
  description: string;
  /** The page's form. */
  children: ReactNode;
  /** Line under the form pointing to the other auth page, e.g. "Don't have an account?". */
  alternate: { prompt: string; label: string; href: string };
  /** Brand panel headline, one entry per line. */
  panelTitleLines: readonly string[];
  /** Brand panel supporting sentence. */
  panelDescription: string;
};

export function AuthShell({
  title,
  description,
  children,
  alternate,
  panelTitleLines,
  panelDescription,
}: AuthShellProps) {
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col border-r bg-muted/60 p-10 lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-linear-to-t from-background to-transparent"
        />
        <div className="z-10">
          <Logo />
        </div>
        <div className="z-10 mt-auto space-y-3">
          <p className="text-2xl font-semibold tracking-tight text-balance">
            {panelTitleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="max-w-md text-muted-foreground">{panelDescription}</p>
        </div>
        <div aria-hidden="true" className="absolute inset-0">
          <DecorativePaths position={1} />
          <DecorativePaths position={-1} />
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <Button
          variant="ghost"
          className="absolute top-7 left-5"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <ChevronLeft aria-hidden="true" />
          Home
        </Button>

        <div className="mx-auto w-full space-y-6 sm:w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {children}

          <p className="text-center text-sm text-muted-foreground">
            {alternate.prompt}{" "}
            <Link
              href={alternate.href}
              className="font-medium text-primary-text underline-offset-4 hover:underline"
            >
              {alternate.label}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

/**
 * A fan of 36 curved lines. `position` mirrors the fan horizontally. Opacity is fixed per line
 * (the template randomised animation timing, which would also differ between server and client).
 */
function DecorativePaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => {
    const shift = i * 5 * position;
    return {
      id: i,
      d: `M-${380 - shift} -${189 + i * 6}C-${380 - shift} -${189 + i * 6} -${312 - shift} ${216 - i * 6} ${152 - shift} ${343 - i * 6}C${616 - shift} ${470 - i * 6} ${684 - shift} ${875 - i * 6} ${684 - shift} ${875 - i * 6}`,
      width: 0.5 + i * 0.03,
      opacity: 0.05 + i * 0.01,
    };
  });

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-foreground"
      viewBox="0 0 696 316"
      fill="none"
    >
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
        />
      ))}
    </svg>
  );
}
