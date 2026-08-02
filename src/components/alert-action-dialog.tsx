"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Button } from "./button";
import { cn } from "../lib/cn";

export type AlertActionDialogVariant = "default" | "destructive";

export const alertActionDialogContentClass =
  "gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-lg sm:max-w-sm";

export const alertActionDialogHeaderClass =
  "flex flex-col items-start gap-3 px-5 pb-4 pt-5 text-left";

export const alertActionDialogFooterClass =
  "flex flex-col-reverse gap-2 border-t border-border/70 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end";

const ICON_BADGE_VARIANT_CLASS: Record<AlertActionDialogVariant, string> = {
  default: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
};

function defaultResolveErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}

export type AlertActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  icon: LucideIcon;
  variant?: AlertActionDialogVariant;
  /** Overrides the auto-resolved error — use for callers that already track error state elsewhere. */
  errorMessage?: string | null;
  /** Resolves a thrown error to display text. Defaults to `error.message` / "Something went wrong". */
  resolveErrorMessage?: (error: unknown) => string;
  onConfirm: () => unknown;
};

/**
 * Shared engine behind `ConfirmDialog` — icon-badge + sectioned card
 * AlertDialog with pending/error handling built in. Generalized from
 * sportik-monorepo's original (production-proven) implementation.
 */
export function AlertActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  icon: Icon,
  variant = "default",
  errorMessage,
  resolveErrorMessage = defaultResolveErrorMessage,
  onConfirm,
}: AlertActionDialogProps) {
  const [pending, setPending] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setInternalError(null);
  }, [open]);

  function guardOpen(next: boolean) {
    if (pending && !next) return;
    onOpenChange(next);
  }

  async function handleConfirm() {
    setPending(true);
    setInternalError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      setInternalError(resolveErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  const shownError = errorMessage ?? internalError;

  return (
    <AlertDialog open={open} onOpenChange={guardOpen}>
      <AlertDialogContent className={alertActionDialogContentClass}>
        <AlertDialogHeader className={alertActionDialogHeaderClass}>
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              ICON_BADGE_VARIANT_CLASS[variant],
            )}
            aria-hidden
          >
            <Icon className="size-5" />
          </span>
          <div className="space-y-1.5">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : null}
          </div>
          {shownError ? (
            <p className="text-sm font-medium text-destructive" role="alert">
              {shownError}
            </p>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter className={alertActionDialogFooterClass}>
          <AlertDialogCancel type="button" disabled={pending}>
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            type="button"
            variant={variant}
            disabled={pending}
            onClick={() => void handleConfirm()}
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
