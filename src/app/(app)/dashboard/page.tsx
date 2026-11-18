import type { Metadata } from "next";

import { DashboardScreen } from "@/features/dashboard/components/dashboard-screen";

/**
 * Dashboard page (/dashboard): where a signed-in member lands to see today at a glance.
 *
 * @packageDocumentation
 */

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Today's standup, streak, weekly score, club and notifications.",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
