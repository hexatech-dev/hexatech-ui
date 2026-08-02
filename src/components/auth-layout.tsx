"use client";

import * as React from "react";

import { heroTitleClass } from "../theme/typography";
import { cn } from "../lib/cn";

export type AuthLayoutFeature = {
  icon?: React.ReactNode;
  title: string;
  description: string;
};

export type AuthLayoutBrand = {
  icon: React.ReactNode;
  name: string;
  subtitle?: string;
};

export type AuthLayoutStory = {
  /** Rendered above eyebrow/title as an icon-tile + name (+ optional subtitle). */
  brand?: AuthLayoutBrand;
  eyebrow?: string;
  title: string;
  description: string;
  features?: AuthLayoutFeature[];
};

export type AuthLayoutLegal = {
  termsHref?: string;
  privacyHref?: string;
};

export type AuthLayoutProps = {
  /** Left-panel copy, hidden below `lg:` — see the component doc comment. */
  story: AuthLayoutStory;
  /** Renders a legal line under the login form only when at least one href is set. */
  legal?: AuthLayoutLegal;
  /** The product's existing login form/card, unchanged. */
  children: React.ReactNode;
  className?: string;
};

/**
 * Side-by-side login shell: product story on the left (hidden below `lg:` —
 * mobile shows only the right-side login view), the consumer's own login
 * form on the right. The left panel's `bg-gradient-brand` reads from each
 * product's own --brand-from/--brand-to override (tokens.css), so it's
 * on-brand automatically with no per-product CSS. `text-white` on that panel
 * matches the existing bg-gradient-header/AppHeader convention rather than a
 * semantic token, since the gradient is designed to always be dark enough
 * for white text regardless of theme.
 */
export function AuthLayout({ story, legal, children, className }: AuthLayoutProps) {
  const { termsHref, privacyHref } = legal ?? {};
  const showLegal = Boolean(termsHref || privacyHref);

  return (
    <div className={cn("min-h-screen lg:grid lg:grid-cols-2", className)}>
      <div className="hidden flex-col justify-center gap-10 bg-gradient-brand p-12 text-white lg:flex">
        {story.brand ? (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
              {story.brand.icon}
            </span>
            <div className="flex flex-col">
              <span className="font-semibold">{story.brand.name}</span>
              {story.brand.subtitle ? (
                <span className="text-xs text-white/70">
                  {story.brand.subtitle}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="max-w-md space-y-4">
          {story.eyebrow ? (
            <span className="text-sm font-medium uppercase tracking-wide opacity-80">
              {story.eyebrow}
            </span>
          ) : null}
          <h1 className={cn(heroTitleClass, "text-balance text-3xl sm:text-4xl")}>
            {story.title}
          </h1>
          <p className="text-base opacity-90 sm:text-lg">{story.description}</p>
        </div>
        {story.features && story.features.length > 0 ? (
          <ul className="max-w-md space-y-4">
            {story.features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                {feature.icon ? (
                  <span className="mt-0.5 shrink-0 opacity-90">{feature.icon}</span>
                ) : null}
                <div>
                  <div className="text-sm font-semibold">{feature.title}</div>
                  <div className="text-sm opacity-80">{feature.description}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:min-h-0">
        <div className="w-full max-w-md">{children}</div>
        {showLegal ? (
          <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            {termsHref ? (
              <a
                href={termsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms
              </a>
            ) : null}
            {termsHref && privacyHref ? " and " : null}
            {privacyHref ? (
              <a
                href={privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </a>
            ) : null}
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
