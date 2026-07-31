"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../lib/cn";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-border/80 bg-secondary/80 p-1 text-muted-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
      "text-muted-foreground hover:bg-card/60 hover:text-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-foreground",
      "data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border/90",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

/** Vertical / horizontal group picker (e.g. a sidebar-style tab list). */
export const sidebarTabsListClass = cn(
  "flex h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-xl",
  "border border-border/80 bg-secondary/80 p-1.5 shadow-sm",
  "lg:flex-col lg:items-stretch lg:overflow-visible lg:rounded-2xl lg:p-2",
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
);

export const sidebarTabsTriggerClass = cn(
  "min-w-[5.5rem] shrink-0 justify-center rounded-lg px-3 py-2.5",
  "text-[11px] font-medium sm:text-xs",
  "shadow-none",
  "lg:min-w-0 lg:justify-start",
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
