#!/usr/bin/env node
// Prepare package.json for `jsr publish`. JSR (deno --unstable-byonm) reads npm
// dependencies from package.json, but a `catalog:` (or `workspace:`) specifier
// is an *invalid version* to deno: it silently drops that dependency, which then
// breaks resolving the matching imports ("Failed resolving './markdown-it'…").
//
// `yarn pack` already resolves those protocols to concrete ranges in the tarball
// it produced for the npm publish, so reuse that: copy the resolved dependency
// fields back over package.json before publishing to JSR. (Runs in the package
// dir; the working src/ — what JSR actually publishes — is untouched.)
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const resolved = JSON.parse(
  execSync("tar -xzOf package.tgz package/package.json", { encoding: "utf8" })
);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

for (const field of [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
]) {
  if (resolved[field]) pkg[field] = resolved[field];
}

writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
