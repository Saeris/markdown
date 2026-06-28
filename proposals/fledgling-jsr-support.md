# Proposal: JSR support in Fledgling

> Status: draft for a feature request to [dmno-dev/fledgling](https://github.com/dmno-dev/fledgling).
> Reference implementation: [`scripts/jsr-claim.mjs`](../scripts/jsr-claim.mjs) (standalone, ~150 lines, runs against the live JSR API).

## Summary

Add a first-time-publish ("claim") flow for **[JSR](https://jsr.io)** packages,
mirroring what Fledgling already does for npm: create each package up front and
wire up **token-less OIDC publishing**, idempotently, across a whole scope /
monorepo — so a subsequent `npx jsr publish` in CI just works, with no
`JSR_TOKEN` secret and no clicking through `jsr.io/new` for every package.

## Motivation

JSR has **no "create on first publish."** Every package must already exist on
jsr.io before anything — CI or a human — can publish a version to it. For a
single package that's one visit to `jsr.io/new`; for a monorepo it's the exact
papercut Fledgling exists to remove. (Concretely: this proposal came out of
publishing a 30-package monorepo, where doing it by hand would mean 30 manual
package creations plus 30 repository links.)

Fledgling already nails this story for npm. JSR users want the same one command.

## How JSR's model differs from npm

The two registries reach the same end state ("the package exists and CI can
publish to it token-lessly"), but by different mechanisms:

| Step                  | npm (what Fledgling does today)                                       | JSR                                                                                 |
| --------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Claim the name**    | publish a `package.json`-only `0.0.0` stub (`npm publish`)            | **create** the package — a metadata record with _no_ versions (`POST` API)          |
| **Set up OIDC**       | `npm trust <github\|gitlab\|circleci> --repo <r> --file <wf> [--env]` | **link the GitHub repo** to the package (`PATCH githubRepository: { owner, name }`) |
| **Exists check**      | `npm view <name> version` / registry `HEAD`                           | `GET /scopes/{scope}/packages/{pkg}`                                                |
| **Auth (setup)**      | `npm login` + interactive 2FA/OTP                                     | a JSR **personal access token** (`Authorization: Bearer`) — no OTP                  |
| **Auth (CI publish)** | OIDC, token-less                                                      | OIDC, token-less                                                                    |

Two things make JSR's setup _simpler_ than npm's:

1. **OIDC is just the repo link.** There's no per-provider config, no workflow
   filename, no environment — any GitHub Actions workflow in the linked repo can
   publish via OIDC. (JSR's OIDC is GitHub-only today.)
2. **No 2FA dance.** The management API authenticates with a bearer token, so
   none of npm's OTP/TOTP/session-warming machinery is needed.

One thing is _different_ rather than simpler: a JSR **scope** (`@mirrordown`)
must exist before its packages can be created. Scope creation is itself an API
call (`POST /scopes`), so Fledgling could optionally create the scope too, or
require it as a prerequisite.

## The flow (human terms)

**Prerequisites:** a JSR scope you own, and a JSR personal access token (jsr.io →
account → Tokens). The token must be **full access** — a token restricted to
"package publish" can publish versions but cannot create packages or link a repo
(see [findings](#real-world-findings)). It's used **once, locally** — it does not
go into CI.

**First, scaffold the manifest.** Unlike npm — where `package.json` already
exists and is the source of truth — JSR reads a separate **`jsr.json`** (or
`deno.json`): `name`, `version`, and `exports` pointing at the TS **source**
(`./src/index.ts`, not the built dist). A first-publish tool should create this
from the existing `package.json` when missing, and validate it when present.

Then, for each target package (e.g. `@mirrordown/mdit-mark`):

1. **Exists?** `GET /scopes/mirrordown/packages/mdit-mark` → `404` means the name
   is free; `200` means it's already claimed (skip the create, still re-assert
   the link so the flow is idempotent).
2. **Claim** the name: `POST /scopes/mirrordown/packages` with `{ "package": "mdit-mark" }`.
3. **Link** the repo: `PATCH /scopes/mirrordown/packages/mdit-mark` with
   `{ "githubRepository": { "owner": "mirrordown", "name": "mirrordown" } }`.

Afterwards, publishing is ordinary CI: a workflow with `permissions: id-token: write`
running `npx jsr publish` authenticates via OIDC against the linked repo — no
token required. Re-running the claim flow is safe: claimed packages are skipped,
and the repo link is re-asserted.

## API reference

Base URL `https://api.jsr.io`; OpenAPI at `https://api.jsr.io/.well-known/openapi`.
Auth header `Authorization: Bearer <token>` (personal/device access token).

| Operation       | Method + path                              | Body                                                               | Notes                                                                                         |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `getPackage`    | `GET /scopes/{scope}/packages/{package}`   | —                                                                  | `200` exists, `404` free                                                                      |
| `createPackage` | `POST /scopes/{scope}/packages`            | `{ "package": "<name>" }`                                          | `200` → `Package`; `400/401/403/404` errors (403 = not a scope member, 404 = scope not found) |
| `updatePackage` | `PATCH /scopes/{scope}/packages/{package}` | `{ "githubRepository": { "owner", "name" } }` (nullable to unlink) | links the repo → enables OIDC                                                                 |
| `createScope`   | `POST /scopes`                             | `{ "scope": "<name>" }`                                            | optional — only if Fledgling also creates scopes                                              |

## Proposed Fledgling integration

Fledgling is npm-specific today: `core.ts` imports `npm.ts` directly, and
`registry` in config means _an npm-compatible registry URL_, not a different
registry type. Adding JSR is therefore mainly an **abstraction** task:

1. **Introduce a registry interface** that `core.ts` depends on instead of
   `npm.ts` — roughly: `exists(name)`, `claim(name)`, `configureTrust(name, repo)`,
   `validateName(name)`.
2. **Implement `jsr.ts`** against that interface using the JSR management API
   (the three calls above), authenticating with a JSR token.
3. **Select the registry** — auto-detect (`jsr.json` / `deno.json` present), an
   explicit `--registry jsr` flag, or config. A package could even target both
   npm _and_ JSR in one run.

Things `jsr.ts` does **not** need (vs `npm.ts`): the `npm trust` CLI, OTP/TOTP
handling, session warming, or per-provider (gitlab/circleci) trust options —
JSR's OIDC is a single repo link and GitHub-only.

### Open questions for the maintainer

- Should a single `fledgling add` target multiple registries (npm + JSR) when a
  package is configured for both?
- Auth: a raw `JSR_TOKEN`, or reuse the `jsr`/`deno` CLI's stored credentials?
- Should Fledgling create the JSR **scope** (`POST /scopes`) if missing, or
  require it as a prerequisite (as npm requires the org)?
- Should Fledgling **scaffold the JSR manifest** (`jsr.json`/`deno.json`) from
  `package.json` when missing? npm needs no equivalent — `package.json` is
  already there — but a JSR package can't publish without one.
- Idempotency/`sync`: JSR has no "revoke trust" — re-linking is a `PATCH`, and
  unlinking is `PATCH githubRepository: null`. Does that map onto `fledgling sync`?

## Reference implementation

[`scripts/jsr-claim.mjs`](../scripts/jsr-claim.mjs) is a self-contained,
idempotent implementation of the flow above, in two phases: **scaffold** (ensure
each package's `jsr.json` exists and is correct, created from `package.json` if
missing or fixed if drifted) then **claim** (`getPackage` → `createPackage` →
`updatePackage`). It discovers targets from `packages/*/package.json` and is
intentionally small and dependency-free so it reads as an executable spec.

```sh
JSR_TOKEN=jsr_xxx node scripts/jsr-claim.mjs --dry-run   # plan
JSR_TOKEN=jsr_xxx node scripts/jsr-claim.mjs             # claim + link
```

## Real-world findings

> Filled in after running the reference script against the live JSR API on the
> `@mirrordown` scope (30 packages). To be folded into the feature request as
> first-hand evidence.

- **Token permission scope required: FULL access, not "package publish".** A
  token restricted to publishing a scope returns `403 missingPermission` on
  `createPackage` (POST) — and on the repo-link `PATCH` — because those are
  management operations, not publishing. Worth calling out in Fledgling's auth
  UX: the claim/link flow needs a broader credential than the CI publish flow.
  ```json
  {
    "code": "missingPermission",
    "message": "The credential this request was authenticated with does not have the necessary permissions to perform this action."
  }
  ```
- **The management API is aggressively rate-limited.** A bulk claim hits
  `429 "Rate exceeded."` after only ~2 packages (≈6 requests). A real
  implementation **must** throttle and retry — the reference script honours
  `Retry-After`, falls back to exponential backoff, and adds a per-package
  cooldown. This is the key operational finding for Fledgling: npm's path doesn't
  need it, but a JSR bulk claim does.
- **Hard cap: 20 NEW packages per scope per rolling week.** Claiming a larger
  monorepo in one pass is impossible by default — the 21st `createPackage`
  returns `400 weeklyPackageLimitExceeded`, and every subsequent create fails
  the same way. This is a **major** finding for Fledgling: a monorepo of >20
  packages can't be bootstrapped in one run. The tool should detect this
  specific code, **stop** (not grind through guaranteed failures), and tell the
  user plainly to re-run after the quota resets or request an increase. (We've
  requested a raise for `@mirrordown`; the remaining 10 claim on a later run.)
  ```json
  {
    "code": "weeklyPackageLimitExceeded",
    "message": "Exceeded weekly limit of 20 new packages for scope."
  }
  ```
- **Confirmed idempotent.** After a partial (cancelled) run, re-running skips
  already-claimed packages via the `getPackage` check (`200` → link only) and
  claims the rest — no errors on the ones already created.
- **A scope-access pre-check pays off.** `GET /user/member/{scope}` (`200` =
  member) confirms the token can manage the scope before touching any package,
  cleanly separating "can't proceed at all" from "already claimed".
- _create (`POST`) on an already-claimed name returns: TBD (the script skips it via the exists check)_
- _whether `npx jsr publish` then succeeds token-lessly via OIDC: TBD_
