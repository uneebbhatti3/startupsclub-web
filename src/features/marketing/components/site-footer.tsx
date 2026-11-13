import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { footerGroups } from "@/features/marketing/lib/content/home";

/**
 * Footer of the marketing site: logo, one-line description, link groups and the theme toggle,
 * on the dotted background, ending in a full-width "StartupsClub" wordmark.
 * Add the About, Blog, Contact and legal links to `footerGroups` as those pages are built.
 *
 * @packageDocumentation
 */

/** Fixed at build time so the page stays fully static. Update with each release. */
const COPYRIGHT_YEAR = 2026;

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t">
      <div aria-hidden="true" className="mk-dots absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The accountability club for founders and developers who are building something.
            </p>
          </div>
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            © {COPYRIGHT_YEAR} StartupsClub. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>

      {/* Edge-to-edge wordmark. SVG text with a fixed textLength always spans the full width at
          any screen size; lengthAdjust="spacing" changes only the letter spacing, so the glyphs
          never stretch even if the heading font changes. Decorative: the name is in the logo and
          the copyright line. fontSize is set so Grifter's natural width is just under 1000, so the
          spacing only ever opens up slightly and the letters never overlap. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 142"
        className="mx-auto block w-full max-w-6xl px-6 font-heading font-semibold text-foreground select-none"
      >
        <defs>
          <linearGradient id="footer-wordmark-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="110"
          fontSize="140"
          textLength="1000"
          lengthAdjust="spacing"
          fill="url(#footer-wordmark-fade)"
        >
          StartupsClub
        </text>
      </svg>
    </footer>
  );
}
