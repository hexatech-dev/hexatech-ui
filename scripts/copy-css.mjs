import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

// tokens.css is never imported by a JS/TS entry, so tsup never touches it —
// copy it into dist manually so the `./tokens.css` export resolves.
const src = "src/theme/tokens.css";
const dest = "dist/theme/tokens.css";

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
