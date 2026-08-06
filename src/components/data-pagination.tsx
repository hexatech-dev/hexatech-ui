"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface DataPaginationProps {
  /** Current 1-based page. */
  page: number;
  pageSize: number;
  /** Total item count across all pages. */
  total: number;
  onPageChange: (page: number) => void;
  /** Page-size <Select> only renders when this is passed. */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  className?: string;
}

function usePaginationState({
  page,
  pageSize,
  total,
}: Pick<DataPaginationProps, "page" | "pageSize" | "total">) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  return {
    totalPages,
    currentPage,
    canGoPrev: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
}

/**
 * Desktop/tablet row: prev/next icon buttons, "Page X of Y", optional
 * page-size select. Hidden below `md` in favor of the mobile row.
 */
function DesktopPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  isLoading = false,
}: DataPaginationProps) {
  const { totalPages, currentPage, canGoPrev, canGoNext } =
    usePaginationState({ page, pageSize, total });

  const goTo = (next: number) => {
    if (next < 1 || next > totalPages) return;
    onPageChange(next);
  };

  return (
    <div className="hidden items-center justify-between gap-4 md:flex">
      <div className="flex items-center gap-4 text-sm">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[70px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goTo(currentPage - 1)}
          disabled={!canGoPrev || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[7rem] text-center text-sm text-muted-foreground">
          Page{" "}
          <span className="font-medium tabular-nums text-foreground">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-medium tabular-nums text-foreground">
            {totalPages}
          </span>
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goTo(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/** Mobile row: large touch-target Previous/Next + a page-count pill. No page-size control. */
function MobilePagination({
  page,
  pageSize,
  total,
  onPageChange,
  isLoading = false,
}: Pick<
  DataPaginationProps,
  "page" | "pageSize" | "total" | "onPageChange" | "isLoading"
>) {
  const { totalPages, currentPage, canGoPrev, canGoNext } =
    usePaginationState({ page, pageSize, total });

  const handlePrev = () => {
    if (canGoPrev && !isLoading) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (canGoNext && !isLoading) onPageChange(currentPage + 1);
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 md:hidden"
    >
      <Button
        variant="outline"
        size="sm"
        className="min-h-11 min-w-[44px] max-w-[50%] flex-1 gap-1.5 rounded-lg font-medium"
        onClick={handlePrev}
        disabled={!canGoPrev || isLoading}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
        <span>Previous</span>
      </Button>
      <div
        className="flex min-w-[4.5rem] shrink-0 items-center justify-center rounded-md bg-muted/80 px-3 py-2"
        aria-current="page"
        aria-label={`Page ${currentPage} of ${totalPages}`}
      >
        <span className="text-sm font-medium tabular-nums text-foreground">
          {currentPage}
        </span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {" "}
          / {totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="min-h-11 min-w-[44px] max-w-[50%] flex-1 gap-1.5 rounded-lg font-medium"
        onClick={handleNext}
        disabled={!canGoNext || isLoading}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
      </Button>
    </nav>
  );
}

/**
 * Responsive pagination: desktop gets prev/next + "Page X of Y" + an
 * optional page-size select, mobile gets larger labeled touch targets.
 * Pure CSS breakpoint switch (`md:`) — both layouts render, no JS
 * viewport hook. `total`/`pageSize` drive `totalPages` internally.
 */
export function DataPagination(props: DataPaginationProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-muted/30 px-4 py-3",
        props.className,
      )}
      data-testid="data-pagination"
    >
      <DesktopPagination {...props} />
      <MobilePagination {...props} />
    </div>
  );
}
