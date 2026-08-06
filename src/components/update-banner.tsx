"use client";

import { X } from "lucide-react";

import { cn } from "../lib/cn";
import { Button } from "./button";

export type UpdateBannerState = "available" | "downloading" | "error";

export interface UpdateBannerProps {
  state: UpdateBannerState;
  /** 0-100, meaningful only while `state === "downloading"`. */
  progress?: number;
  versionName?: string;
  onUpdate: () => void;
  onDismiss: () => void;
  title?: string;
  updateLabel?: string;
  formatDownloadingLabel?: (progress: number) => string;
  errorLabel?: string;
  retryLabel?: string;
  dismissAriaLabel?: string;
  className?: string;
}

/**
 * Non-blocking, dismissible bottom banner nudging the user toward a newer
 * native build — pairs with `useAppUpdateCheck`. Rendered alongside the app
 * tree (not wrapping it), so the rest of the screen stays fully usable
 * underneath. Anchored above `env(safe-area-inset-bottom)` plus an optional
 * consumer-defined `--update-banner-offset` (e.g. the height of a bottom nav
 * bar), same "consumer-defined CSS var, sensible zero default" pattern as
 * `--status-bar-height`.
 */
export function UpdateBanner({
  state,
  progress = 0,
  versionName,
  onUpdate,
  onDismiss,
  title = "Update available",
  updateLabel = "Update",
  formatDownloadingLabel = (p) => `Downloading… ${p}%`,
  errorLabel = "Update failed",
  retryLabel = "Retry",
  dismissAriaLabel = "Dismiss",
  className,
}: UpdateBannerProps) {
  const isDownloading = state === "downloading";
  const isError = state === "error";

  return (
    <div
      className={cn(
        "fixed inset-x-3 z-[100] flex items-center gap-3 rounded-xl border bg-background p-3 shadow-lg",
        className,
      )}
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom, 0px) + var(--update-banner-offset, 0.75rem))",
      }}
      role="status"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {isError ? errorLabel : title}
          {versionName && !isError ? (
            <span className="ml-1 font-normal text-muted-foreground">
              ({versionName})
            </span>
          ) : null}
        </p>

        {isDownloading ? (
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </div>

      <Button size="sm" onClick={onUpdate} disabled={isDownloading}>
        {isDownloading
          ? formatDownloadingLabel(progress)
          : isError
            ? retryLabel
            : updateLabel}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onDismiss}
        disabled={isDownloading}
        aria-label={dismissAriaLabel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
