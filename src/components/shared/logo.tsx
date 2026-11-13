import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * StartupsClub logo. Shows the black wordmark in light mode and the white wordmark in dark mode.
 * With `compactOnMobile`, screens below the `sm` breakpoint get the icon-only mark instead.
 * Theme and size switching is done in CSS (the `dark:` and `sm:` variants) rather than by reading
 * the theme in JavaScript, so the server render is correct and nothing flashes on hydration.
 *
 * @packageDocumentation
 */

type LogoProps = {
  /** Show the icon-only mark below the `sm` breakpoint. Used by the site header. */
  compactOnMobile?: boolean;
  className?: string;
};

const ALT = "Startups Club";

export function Logo({ compactOnMobile = false, className }: LogoProps) {
  const wordmarkVisibility = compactOnMobile ? "hidden sm:block" : "block";

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo-black.png"
        alt={ALT}
        width={1099}
        height={154}
        className={cn("h-auto w-30 dark:hidden", wordmarkVisibility)}
      />
      <Image
        src="/logo-white.png"
        alt={ALT}
        width={1099}
        height={154}
        className={cn("hidden h-auto w-30", compactOnMobile ? "sm:dark:block" : "dark:block")}
      />
      {compactOnMobile && (
        <>
          <Image
            src="/logo-icon-black.png"
            alt={ALT}
            width={2048}
            height={2048}
            className="block size-7 sm:hidden dark:hidden"
          />
          <Image
            src="/logo-icon-white.png"
            alt={ALT}
            width={2048}
            height={2048}
            className="hidden size-7 dark:block sm:dark:hidden"
          />
        </>
      )}
    </span>
  );
}
