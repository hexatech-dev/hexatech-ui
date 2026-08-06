import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/lib/*.ts",
    "src/theme/*.ts",
    "src/theme/*.tsx",
    "src/hooks/*.ts",
    "src/components/*.tsx",
    "src/icons/*.tsx",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: "dist",
  // react/react-dom must resolve to the CONSUMER's single copy — bundling
  // whatever version happens to be in this repo's devDependencies at build
  // time causes duplicate-React/invalid-hook-call errors for any consumer
  // on a different React major (see peerDependencies range: 18 and 19 both
  // need to work). esbuild preserves a leading "use client" directive on
  // each entry file automatically — every component/theme file here starts
  // with one, so no extra config is needed for that.
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ],
});
