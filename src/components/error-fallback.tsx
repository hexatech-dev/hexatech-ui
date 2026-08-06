"use client";

import { WifiOff, AlertTriangle } from "lucide-react";

import { cn } from "../lib/cn";
import { pageHeadingClass } from "../theme/typography";
import { useOnlineStatus } from "../hooks/use-online-status";
import { Card, CardContent } from "./card";
import { Button } from "./button";

export interface ErrorFallbackProps {
  chunkError: boolean;
  onRetry: () => void;
}

/** Full-screen fallback for `ErrorBoundary`/a router's own errorElement. */
export function ErrorFallback({ chunkError, onRetry }: ErrorFallbackProps) {
  const isOnline = useOnlineStatus();
  const offline = chunkError && !isOnline;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-4 shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {offline ? (
            <WifiOff className="h-8 w-8 text-destructive" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-destructive" />
          )}
          <h1 className={cn(pageHeadingClass, "text-foreground")}>
            {offline ? "You're offline" : "Something went wrong"}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {offline
              ? "This page couldn't load because there's no internet connection. Reconnect and try again."
              : chunkError
                ? "A new version of the app is available. Reload to continue."
                : "The app ran into an unexpected error. Reloading usually fixes it."}
          </p>
          <Button onClick={onRetry}>Retry</Button>
        </CardContent>
      </Card>
    </div>
  );
}
