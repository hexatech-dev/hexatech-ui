# @hexatech-dev/ui

Shared, themeable UI components for Hexatech products (credbox, jalkhata,
janmat, sportik, hexatech-website). This repo is public and consumed as a
plain git dependency — no package registry, no token, anywhere (local
installs or Vercel builds). Same distribution model as `hexatech-shared`.

Generalized from sportik's `client/src/shared/components/ui/` (the most
advanced component set in the company today) so other products can stop
copy-pasting its components while keeping their own branding.

## Installing

```json
"@hexatech-dev/ui": "github:hexatech-dev/hexatech-ui#v0.1.0"
```

`npm install` clones the tagged commit and runs this package's own `prepare`
script (`npm run build`) to produce `dist/` — no registry, works identically
on a laptop and on Vercel.

## Theming — how branding works

1. Add the Tailwind preset to your own `tailwind.config.ts`:

   ```ts
   export default {
     presets: [require("@hexatech-dev/ui/tailwind-preset")],
     content: [
       "./client/index.html",
       "./client/src/**/*.{js,jsx,ts,tsx}",
       "./node_modules/@hexatech-dev/ui/dist/**/*.js", // required — see below
     ],
   } satisfies Config;
   ```

   The `node_modules/@hexatech-dev/ui/dist/**/*.js` content glob is required:
   components ship their Tailwind class names as plain strings, not
   pre-built CSS, so your own Tailwind build has to scan them to generate
   the matching utility classes.

2. Import the token stylesheet once, then override the CSS variables with
   your own brand palette in the same file:

   ```css
   @import "@hexatech-dev/ui/tokens.css";

   :root {
     --primary: 214 72% 40%; /* your brand color, HSL triplet */
     --primary-foreground: 0 0% 100%;
     /* ... see tokens.css for the full variable list */
   }

   .dark {
     --primary: 214 72% 52%;
     /* ... */
   }
   ```

   `tokens.css` ships neutral placeholder values — never a real product's
   brand colors — so every product overrides the same variable *names*
   with its own values. Components never hardcode colors; they only
   reference these tokens via the Tailwind preset.

3. Wrap your app in `ThemeProvider` (dark/light toggling + persistence
   only — brand colors are static CSS, not runtime state):

   ```tsx
   import { ThemeProvider } from "@hexatech-dev/ui/theme-provider";

   <ThemeProvider storageKey="credbox-theme">
     <App />
   </ThemeProvider>;
   ```

## Components

One subpath export per component (e.g. `@hexatech-dev/ui/button`,
`@hexatech-dev/ui/dialog`) — no barrel import, so consumers only pull in
what they use. Full list: `accordion`, `alert`, `alert-action-dialog`,
`alert-dialog`, `aspect-ratio`, `auth-layout`, `avatar`, `badge`,
`breadcrumb`, `button`, `card`, `checkbox`, `collapsible`, `confirm-dialog`,
`data-pagination`, `dialog`, `dropdown-menu`, `empty-state`,
`error-boundary`, `error-fallback`, `error-state`, `form-overlay`, `input`,
`label`, `navigation-menu`, `network-status-badge`, `pagination`, `popover`,
`radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`,
`spinner`, `switch`, `table`, `tabs`, `textarea`, `toast` + `toaster`
(+ `use-toast` hook), `toggle`, `toggle-group`, `tooltip`, `update-banner`
(+ `use-app-update-check` hook), `user-avatar`, `google-icon`. Plus `cn`
(the `clsx`+`tailwind-merge` helper every component uses for `className`
merging), `chunk-error`, `use-online-status`, `use-mobile`.

**`update-banner` + `use-app-update-check`**: a non-blocking, dismissible
bottom banner for nudging users toward a newer native build, paired with a
headless hook that checks a `{ data: { versionCode } }` endpoint against
`CapacitorApp.getInfo().build`, downloads the APK with progress, and hands
it to the native installer via `FileOpener`. Native-only (no-ops on web) and
the only export here with optional Capacitor peer dependencies
(`@capacitor/app`, `@capacitor/core`, `@capacitor/filesystem`,
`@capacitor-community/file-opener`) — only a consumer that imports
`use-app-update-check` needs them installed. First adopted by sportik,
replacing its previous blocking modal-on-launch dialog.

Every component file starts with `"use client"` — safe to import from a
Next.js Server Component tree (App Router) as well as a plain Vite SPA.

**Not included** (deliberately, per the extraction criteria — token-only,
non-domain-specific): app-shell/nav components like a full `Sidebar`,
anything with embedded business logic, and a few components that need a
second real consumer before their API is worth locking in (`calendar`,
`stepper`, `number-input`, a react-hook-form `form` wrapper). Add these
later on demand rather than speculatively.

## Build

Built with `tsup`, not plain `tsc` (unlike `hexatech-shared`) — each
component/theme file is its own entry point (not one big bundle) so the
leading `"use client"` directive survives per-file, which Next.js's RSC
compiler needs. `react`/`react-dom`/`react/jsx-runtime` are marked
`external` in `tsup.config.ts`; Radix/cva/clsx/tailwind-merge/lucide-react
are regular `dependencies` in `package.json`, which tsup automatically
excludes from the bundle too — they resolve from the consumer's own
`node_modules` like any normal npm dependency, they are not inlined.

`peerDependencies` allow both `react@^18.3` and `react@^19` — verify both
still work before bumping that range.

## Versioning

Same model as `hexatech-shared`: bump deliberately, tag a release, update
the `#v<version>` pin in each consumer, no auto-update.

```bash
npm version <patch|minor|major>
git push --follow-tags
```

## Local development against this package

```bash
npm run build   # in hexatech-ui
npm link        # in hexatech-ui
npm link @hexatech-dev/ui   # in the consumer repo
```
