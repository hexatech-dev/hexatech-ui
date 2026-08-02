"use client";

import { AlertTriangle, HelpCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  AlertActionDialog,
  type AlertActionDialogVariant,
} from "./alert-action-dialog";

export type ConfirmDialogVariant = AlertActionDialogVariant;

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  /** @default "default" */
  variant?: ConfirmDialogVariant;
  /** Overrides the default per-variant icon. */
  icon?: LucideIcon;
  /** Overrides the auto-resolved error — use for callers that already track error state elsewhere. */
  errorMessage?: string | null;
  /** Resolves a thrown error to display text. Defaults to `error.message` / "Something went wrong". */
  resolveErrorMessage?: (error: unknown) => string;
  onConfirm: () => unknown;
};

const DEFAULT_ICON: Record<ConfirmDialogVariant, LucideIcon> = {
  default: HelpCircle,
  destructive: AlertTriangle,
};

/**
 * General-purpose confirmation dialog (works for destructive deletes and
 * plain "are you sure" prompts alike). Generalized from sportik-monorepo's
 * original (production-proven) implementation.
 */
export function ConfirmDialog({
  variant = "default",
  icon,
  ...props
}: ConfirmDialogProps) {
  return (
    <AlertActionDialog
      {...props}
      variant={variant}
      icon={icon ?? DEFAULT_ICON[variant]}
    />
  );
}
