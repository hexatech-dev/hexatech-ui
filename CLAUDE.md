# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@hexatech-dev/ui` — themeable UI components shared across Hexatech products, generalized from sportik's component set. See `README.md` for the component list, theming integration steps, and consumption instructions; this file is about *contributing to* the package.

## Hexatech ecosystem

Sibling repo to `../hexatech-shared` (`@hexatech-dev/shared`) — same distribution model (GitHub git dependency, tag-pinned, no registry), separate repo because this one needs JSX/CSS-aware build tooling (`tsup`) instead of `hexatech-shared`'s plain `tsc`. Lives alongside the five product repos (credbox, jalkhata, janmat, sportik, hexatech-website) under `~/Workspace/Hexatech/` — not a monorepo, each is its own independent git repo.

As of this package's creation, no product repo consumes it yet — the reuse rollout adopts it starting with janmat (test users, simplest repo), then jalkhata, then credbox/sportik last (production). Check `README.md`'s version matrix reference in `hexatech-shared` for current adoption status before assuming any product already uses a given component.

## Non-negotiable rules

1. **Every component/theme file starts with `"use client"`.** These are interactive primitives that must work when imported from a Next.js Server Component tree. Don't remove it, and add it to any new file you create here.
2. **Never hardcode a color.** Components reference only the Tailwind classes mapped in `src/theme/tailwind-preset.ts` (which map to the CSS variable *names* in `src/theme/tokens.css`). `tokens.css` ships neutral placeholder values, never a real product's brand palette — branding lives in each *consumer's* own `:root`/`.dark` override, not here.
3. **`tsup.config.ts`'s `external` array must keep `react`/`react-dom`/`react/jsx-runtime`/`react/jsx-dev-runtime`.** If this repo's own build ever bundles React, any consumer on a different React major (the company currently spans React 18 and 19) gets duplicate-React/invalid-hook-call errors at runtime. This is the single highest-risk mistake to make in this package — verify after any `tsup.config.ts` change by grepping a built `dist/components/*.js` file for `from "react"` (should stay an unbundled import, not inlined code).
4. **One file per component, one `exports` subpath per file** (e.g. `./button` → `dist/components/button.js`) — no barrel `index.ts`. Adding a component means: new file in `src/components/`, new entry in `tsup.config.ts`'s glob (already covers `src/components/*.tsx`, so usually no change needed there), new subpath in `package.json`'s `exports` map.
5. **Radix/cva/clsx/tailwind-merge/lucide-react are regular `dependencies` in `package.json`**, not bundled — tsup automatically excludes anything listed there from the bundle, so they resolve from the consumer's own `node_modules`. If a new component needs a new Radix package (or similar), add it to `dependencies`, not just import it — otherwise it silently gets bundled in instead of externalized.

## `toaster`/`use-toast` are a singleton store, not pure presentation

Unlike every other component here, `toaster.tsx` reads from `use-toast.ts`'s
module-scoped `memoryState`/`listeners` — an actual store, not just markup.
A consumer that re-exports this package's `toaster.tsx` wholesale while its
own existing call sites still dispatch to their **own** local `use-toast`
copy ends up with two disconnected stores: toasts fire but never render,
since the mounted `<Toaster />` is listening to a different instance than
the one being dispatched to. Hit for real in sportik (see its `CLAUDE.md`).

If a consumer already has its own toast call sites, keep its `toaster.tsx`
**local** — importing its own `useToast` plus this package's presentational
`Toast`/`ToastClose`/`ToastTitle`/etc. from `./toast` (which have no internal
state, safe to share as-is). Only a **new** consumer with zero existing
`toast(...)` call sites can safely adopt this package's `toaster`/`use-toast`
wholesale as its one and only store.

## Extraction criteria (for adding more components later)

Only pull a component from a product (currently sportik) into this package if it's genuinely token-only and free of that product's domain logic or hardcoded branding — verify by reading the source file, don't assume. Components with embedded business logic, app-shell/nav specifics (e.g. a full `Sidebar`), or that only have one real consumer so far and no proven-generic API (e.g. a `calendar`/`stepper`/`form` wrapper) should wait for a second real consumer before extraction — don't extract speculatively.

## Build

```bash
npm run build   # tsup (per-entry ESM + .d.ts) + scripts/copy-css.mjs (tokens.css doesn't go through tsup)
npm run check   # tsc --noEmit
```

`npm run prepare` (fires automatically on `npm install` via a git dependency) runs `build`.

## Versioning

Same model as `hexatech-shared`: bump deliberately, tag, no auto-update. `npm version <patch|minor|major> && git push --follow-tags`, then update the pin in whichever consumer needs the change, and update the version matrix in `../hexatech-shared/README.md`.

**Verify locally before bumping/pushing/rolling out — don't design in production.** Every consumer is a separate git repo pinned to an exact tag (no registry, no CI, no auto-update — see `README.md`), so each version bump means: push a tag, then manually update the pin + `npm install` + clear Vite's `node_modules/.vite` cache + restart the dev server, **per consumer**. That's real ceremony, and paying it once per finished change is fine — paying it three times because a component's design was still being iterated on live is not (this happened for real with `toast.tsx`: three version bumps and three full rollouts in one sitting for what should've been one). Iterate locally first:

```bash
npm run build && npm pack        # produces hexatech-dev-ui-X.Y.Z.tgz
cd ../<one-test-consumer>
npm install ../hexatech-ui/hexatech-dev-ui-X.Y.Z.tgz   # real copy, not a symlink — avoids
                                                          # npm link's duplicate-React risk (rule #3)
```

Repeat edit → `npm run build && npm pack` → reinstall the tarball → look at it, for as many rounds as needed against one representative consumer. Only once it's actually settled: revert that consumer's `package.json`/`package-lock.json` (`git checkout` them), then do the real `commit → npm version → push --follow-tags → bump the pin in every consumer that needs it → npm install → clear `.vite` caches → restart dev servers` sequence — once, not per iteration.
