"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** localStorage key — namespace per product so multiple Hexatech apps on
   * the same origin/device don't fight over one key. */
  storageKey?: string;
  defaultTheme?: Theme;
}

export interface ThemeContextValue {
  theme: Theme;
  /** The theme actually applied after resolving "system". */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Dark/light class toggling + persistence only — deliberately does not
 * manage brand colors (those are static per-product CSS, not runtime
 * state). Framework-agnostic (plain React context + localStorage), unlike
 * `next-themes`, so it behaves identically in a Next.js app and a plain
 * Vite SPA.
 */
export function ThemeProvider({
  children,
  storageKey = "hexatech-theme",
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (window.localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme;
  });

  const resolvedTheme = resolveTheme(theme);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  React.useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      window.document.documentElement.classList.toggle(
        "dark",
        media.matches,
      );
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      window.localStorage.setItem(storageKey, next);
      setThemeState(next);
    },
    [storageKey],
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
