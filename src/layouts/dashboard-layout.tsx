import type { CSSProperties, ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * Shell for the app pages: the sidebar, the header and the page content. The sidebar is passed in
 * by the route, which wires it to the session.
 *
 * @packageDocumentation
 */

type DashboardLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      {sidebar}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
