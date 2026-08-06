"use client";

import { WifiOff } from "lucide-react";

import { cn } from "../lib/cn";
import { useOnlineStatus } from "../hooks/use-online-status";
import { Badge, type BadgeProps } from "./badge";

export interface NetworkStatusBadgeProps
  extends Omit<BadgeProps, "variant" | "children"> {
  label?: string;
}

/** Renders nothing while online; shows an "Offline" badge only when the connection drops. */
export function NetworkStatusBadge({
  className,
  label = "Offline",
  ...props
}: NetworkStatusBadgeProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Badge
      variant="destructive"
      className={cn("gap-1", className)}
      {...props}
    >
      <WifiOff className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  );
}
