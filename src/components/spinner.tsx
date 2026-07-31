"use client";

/**
 * Full-route/full-panel loading indicator — use only before any layout
 * exists yet (route transitions, initial shell load). Once a layout is
 * rendered, prefer `Skeleton` for loading content inside it — skeletons
 * preserve layout stability, this doesn't.
 */
const Spinner = ({ title = "Loading..." }: { title?: string }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="relative flex size-12 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-r-primary/40 border-t-primary" />
        <div className="size-2.5 animate-pulse rounded-full bg-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

export default Spinner;
