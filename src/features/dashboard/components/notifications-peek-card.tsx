"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardSlice } from "@/features/dashboard/hooks/use-dashboard";
import { formatRelative } from "@/features/dashboard/lib/dashboard-content";

/**
 * The latest notifications, unread ones marked with a dot, and a link to the full list.
 * `NotificationsPeekCardSkeleton` is its loading placeholder for `<Suspense>`.
 *
 * @packageDocumentation
 */

type NotificationsPeekCardProps = {
  className?: string;
};

export function NotificationsPeekCard({ className }: NotificationsPeekCardProps) {
  const notifications = useDashboardSlice((dashboard) => dashboard.notifications);
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>{unread > 0 ? `${unread} unread` : "All caught up"}</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/notifications" />}
          >
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    notification.read ? "bg-transparent" : "bg-primary",
                  )}
                />
                <div className="grid gap-0.5">
                  <p className="text-sm">
                    {notification.read ? null : <span className="sr-only">Unread: </span>}
                    {notification.message}
                  </p>
                  <time dateTime={notification.createdAt} className="text-xs text-muted-foreground">
                    {formatRelative(notification.createdAt)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function NotificationsPeekCardSkeleton({ className }: NotificationsPeekCardProps) {
  return (
    <Card className={className} aria-busy="true" aria-label="Loading notifications">
      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-16" />
        <CardAction>
          <Skeleton className="h-7 w-16" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid gap-1.5 pl-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
