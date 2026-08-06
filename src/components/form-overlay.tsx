"use client";

import type { ReactNode } from "react";

import { useIsMobile } from "../hooks/use-mobile";
import { dialogTitleClass } from "../theme/typography";
import { cn } from "../lib/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet";

export type FormOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  /** Shell uses `gap-0 p-0`; header, body, and footer supply their own spacing. */
  flush?: boolean;
  /** Forwarded to the underlying Dialog/Sheet content — e.g. to guard a dirty form against an accidental outside click. */
  onPointerDownOutside?: (event: Event) => void;
  /** Forwarded to the underlying Dialog/Sheet content — e.g. to guard a dirty form against an accidental Escape press. */
  onEscapeKeyDown?: (event: Event) => void;
};

type OverlayChromeProps = {
  title: ReactNode;
  description?: ReactNode;
  headerClassName?: string;
  flush: boolean;
  mobile: boolean;
};

/** Reserves room for the corner close (X) control so a long title/description never runs under it. */
const overlayHeaderClearanceClass = "pr-11 sm:pr-12";

function OverlayHeader({
  title,
  description,
  headerClassName,
  flush,
  mobile,
}: OverlayChromeProps) {
  const titleClass = cn(dialogTitleClass, flush && "text-base");

  if (mobile) {
    return (
      <div
        className={cn(
          "shrink-0 border-b border-border/80 px-4 py-3 text-left",
          overlayHeaderClearanceClass,
          headerClassName,
        )}
      >
        <SheetTitle className={titleClass}>{title}</SheetTitle>
        {description ? (
          <SheetDescription className="mt-1.5 line-clamp-2">
            {description}
          </SheetDescription>
        ) : null}
      </div>
    );
  }

  return (
    <DialogHeader
      className={cn(
        "shrink-0 space-y-1.5 border-b border-border px-4 py-3.5 text-left sm:px-5",
        overlayHeaderClearanceClass,
        headerClassName,
      )}
    >
      <DialogTitle className={titleClass}>{title}</DialogTitle>
      {description ? (
        <DialogDescription className="text-sm text-muted-foreground">
          {description}
        </DialogDescription>
      ) : null}
    </DialogHeader>
  );
}

function OverlayBody({
  children,
  bodyClassName,
  flush,
  mobile,
  hasFooter,
}: {
  children: ReactNode;
  bodyClassName?: string;
  flush: boolean;
  mobile: boolean;
  hasFooter: boolean;
}) {
  // A footer already carries its own safe-area bottom padding — without one,
  // the body is the last thing on screen and needs to clear the home
  // indicator itself, on every consumer, without each one repeating this.
  const safeAreaBottomClass = !hasFooter
    ? "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    : undefined;

  if (mobile) {
    return (
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain",
          flush ? bodyClassName : cn("px-4 py-3", bodyClassName),
          safeAreaBottomClass,
        )}
      >
        {/*
         * `min-h-full` + `justify-center` live on this inner wrapper, not on
         * the scrolling div above — centering a short-content sheet directly
         * on an `overflow-y-auto` flex container clips the top of any content
         * that later grows past it (browsers don't reliably scroll to the
         * "before center" overflow). This wrapper only affects layout when
         * content is shorter than the sheet's min-height; taller content
         * just flows top-down and scrolls normally.
         */}
        <div className="flex min-h-full flex-col justify-center">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain",
        flush ? bodyClassName : cn("px-4 py-4 sm:px-5", bodyClassName),
      )}
    >
      {children}
    </div>
  );
}

function OverlayFooter({
  footer,
  footerClassName,
  flush,
  mobile,
}: {
  footer: ReactNode;
  footerClassName?: string;
  flush: boolean;
  mobile: boolean;
}) {
  if (mobile) {
    return (
      <div
        className={cn(
          "shrink-0 border-t border-border/80 bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          !flush && "flex justify-end gap-2",
          footerClassName,
        )}
      >
        {footer}
      </div>
    );
  }

  return (
    <DialogFooter
      className={cn(
        "shrink-0 gap-2 border-t border-border px-4 py-3.5 sm:justify-end sm:px-5",
        footerClassName,
      )}
    >
      {footer}
    </DialogFooter>
  );
}

/**
 * Form overlay: centered dialog on desktop, bottom sheet on mobile (&lt;768px).
 * Use for input flows; keep AlertDialog for confirmations.
 */
export function FormOverlay({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  flush = false,
  onPointerDownOutside,
  onEscapeKeyDown,
}: FormOverlayProps) {
  const isMobile = useIsMobile();
  const hasFooter = Boolean(footer);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          onPointerDownOutside={onPointerDownOutside}
          onEscapeKeyDown={onEscapeKeyDown}
          className={cn(
            "flex max-h-[90dvh] min-h-[45dvh] flex-col gap-0 rounded-t-2xl border-border/60 p-0",
            contentClassName,
          )}
        >
          <OverlayHeader
            title={title}
            description={description}
            headerClassName={headerClassName}
            flush={flush}
            mobile
          />
          <OverlayBody
            bodyClassName={bodyClassName}
            flush={flush}
            hasFooter={hasFooter}
            mobile
          >
            {children}
          </OverlayBody>
          {footer ? (
            <OverlayFooter
              footer={footer}
              footerClassName={footerClassName}
              flush={flush}
              mobile
            />
          ) : null}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={onPointerDownOutside}
        onEscapeKeyDown={onEscapeKeyDown}
        className={cn(
          "flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0",
          flush ? "max-w-lg sm:max-w-xl" : "max-w-md rounded-2xl border-border/60",
          contentClassName,
        )}
      >
        <OverlayHeader
          title={title}
          description={description}
          headerClassName={headerClassName}
          flush={flush}
          mobile={false}
        />
        <OverlayBody
          bodyClassName={bodyClassName}
          flush={flush}
          hasFooter={hasFooter}
          mobile={false}
        >
          {children}
        </OverlayBody>
        {footer ? (
          <OverlayFooter
            footer={footer}
            footerClassName={footerClassName}
            flush={flush}
            mobile={false}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
