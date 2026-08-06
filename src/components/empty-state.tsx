"use client";

import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

import { cn } from "../lib/cn";
import { sectionHeadingClass } from "../theme/typography";

export interface EmptyStateProps {
  /** Defaults to `SearchX` when omitted. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Controls padding and icon scale. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Action buttons rendered below the description. */
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
 * Centered dashed "empty shelf" pattern: icon halo, title, optional
 * description & actions. Pairs with {@link ErrorState}.
 */
export function EmptyState({
  icon,
  title,
  description,
  size = "md",
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 text-center",
        sizeClasses[size],
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          iconWrapperSizeClasses[size],
        )}
        aria-hidden
      >
        {icon ?? <SearchX />}
      </div>
      <h3 className={cn(sectionHeadingClass, "text-foreground")}>{title}</h3>
      {description != null && description !== "" ? (
        <div className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
      ) : null}
      {children ? (
        <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2 pt-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
