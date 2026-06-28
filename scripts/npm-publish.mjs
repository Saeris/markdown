#!/usr/bin/env node
/* oxlint-disable no-console */
// Idempotent npm publish of the package.tgz built by `yarn pack`. Skips when the
// version is already on the registry, so a release that failed *after* the npm
// step (e.g. a later JSR step) can be retried without an "already published"
// error — the publishCommand's npm + JSR steps stay independently recoverable.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { name, version } = JSON.parse(readFileSync("package.json", "utf8"));

let onRegistry = false;
try {
  execSync(`npm view ${name}@${version} version`, { stdio: "ignore" });
  onRegistry = true;
} catch {
  /* not published yet */
}

if (onRegistry) {
  console.log(`  ${name}@${version} already on npm — skipping`);
} else {
  execSync("npm publish package.tgz --access public", { stdio: "inherit" });
}
