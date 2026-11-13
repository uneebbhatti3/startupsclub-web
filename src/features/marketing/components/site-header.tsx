"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MarketingButton } from "@/features/marketing/components/marketing-button";
import { navLinks, showWaitlist, waitlistLink } from "@/features/marketing/lib/content/home";
import { cn } from "@/lib/utils";

/**
 * Sticky header of the marketing site: logo, section links, theme toggle and the waitlist action.
 * It gains a blurred surface after the page scrolls, and collapses into a menu on small screens.
 *
 * @packageDocumentation
 */

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Named for page transitions: the header stays still while the page content changes.
    <header className="sticky top-0 z-50 px-4 pt-3 [view-transition-name:site-header]">
      <div
        className={cn(
          "relative z-10 mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-4 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5",
          scrolled || open
            ? "mk-card-shadow border-border bg-background/80 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Link href="/" aria-label="StartupsClub home" className="rounded-full">
          <Logo compactOnMobile />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {showWaitlist ? (
            <MarketingButton
              href={waitlistLink.href}
              variant="shine"
              className="hidden sm:inline-flex"
            >
              {waitlistLink.label}
            </MarketingButton>
          ) : null}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-muted md:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-4" />
            ) : (
              <Menu aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Always rendered so it can animate out. Absolute, so opening it never pushes the page;
          it sits below the bar (z-0 vs z-10) and slides out from underneath. `inert` keeps the
          hidden links out of the tab order and the accessibility tree. */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        inert={!open}
        className={cn(
          "mk-card-shadow absolute inset-x-4 top-full z-0 mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-border bg-background p-3 transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0",
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}
        {showWaitlist ? (
          <div className="mt-1 border-t border-border pt-3">
            <MarketingButton
              href={waitlistLink.href}
              variant="glow"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {waitlistLink.label}
            </MarketingButton>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
