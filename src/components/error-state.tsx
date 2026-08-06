"use client";

import type { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { cn } from "../lib/cn";
import { sectionHeadingClass } from "../theme/typography";
import { Button } from "./button";

export interface ErrorStateProps {
  /** Defaults to `AlertCircle` when omitted. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Controls padding and icon scale. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Shows a retry button that calls this handler. */
  onRetry?: () => void;
  /** Disables the retry button and spins its icon while a retry is in flight. */
  isRetrying?: boolean;
  /** Retry button label. Defaults to `"Try again"` — pass a translated string if needed. */
  retryLabel?: string;
  /** Extra actions rendered beside the retry button. */
  children?: ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "py-8 gap-2",
  md: "py-12 gap-3",
  lg: "py-16 gap-4",
} as const;

const iconWrapperSizeClasses = {
  sm: "size-10 [&_svg]:size-5",
  md: "size-12 [&_svg]:size-6",
  lg: "size-14 [&_svg]:size-7",
} as const;

/**
 * Centered error panel — destructive tint, optional retry. Pairs with
 * {@link EmptyState}.
 */
export function ErrorState({
  icon,
  title,
  description,
  size = "md",
  onRetry,
  isRetrying = false,
  retryLabel = "Try again",
  children,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/[0.04] px-6 text-center shadow-sm",
        sizeClasses[size],
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-destructive/25 bg-destructive/10 text-destructive shadow-sm",
          iconWrapperSizeClasses[size],
        )}
        aria-hidden
      >
        {icon ?? <AlertCircle />}
      </div>
      <h3 className={cn(sectionHeadingClass, "text-foreground")}>{title}</h3>
      {description != null && description !== "" ? (
        <div className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
      ) : null}
      {onRetry != null || children ? (
        <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2 pt-1">
          {onRetry != null ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 border-destructive/30 hover:bg-destructive/10"
              disabled={isRetrying}
              onClick={onRetry}
            >
              <RefreshCw
                className={cn(
                  "size-4 shrink-0",
                  isRetrying && "animate-spin",
                )}
                aria-hidden
              />
              {retryLabel}
            </Button>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
