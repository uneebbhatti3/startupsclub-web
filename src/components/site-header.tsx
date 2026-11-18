"use client";

import { usePathname } from "next/navigation";

import { appNavTitle } from "@/config/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Top bar of the app shell: the sidebar toggle, the theme toggle and the name of the current
 * section, taken from the sidebar links. The page itself owns the `h1`, so the name here is plain
 * text.
 *
 * @packageDocumentation
 */

export function SiteHeader() {
  const title = appNavTitle(usePathname());

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <ThemeToggle className="rounded-md border-none" />
        {title ? (
          <>
            <Separator orientation="vertical" className="mx-2 h-4 data-vertical:self-auto" />
            <p className="text-base font-medium">{title}</p>
          </>
        ) : null}
      </div>
    </header>
  );
}
