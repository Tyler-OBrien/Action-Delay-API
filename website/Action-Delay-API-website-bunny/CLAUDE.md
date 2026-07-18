# CLAUDE.md — Bunny site

Guidance for Claude Code when working in `website/Action-Delay-API-website-bunny`.

This is the **Bunny-focused fork** of the main website (`website/Action-Delay-API-website`). The shared
architecture, component patterns, models, and most page structure are documented in that project's `CLAUDE.md` —
read it for anything not Bunny-specific. This file only covers what diverges.

## How this fork differs from the main site

- **Scope is Bunny only.** It shows the `BunnyDelay` job type and the `bunny-*` performance jobs; AI and the
  Cloudflare-routing pages are dropped. `/perf` filters to `internalJobName` starting `bunny-`; `/locations` is a
  plain agent list (no CF colo / path-to-CF / CF-latency columns). Page copy says "Bunny", not "Cloudflare".
- **Deployed to Bunny Edge Scripting, not Cloudflare.** Uses the Deno SSR adapter (`@deno/astro-adapter`) instead of
  `@astrojs/cloudflare`. `astro.config.mjs` sets `adapter: deno()`.

## Data wiring

- **SSR pages** (`.astro` frontmatter fetches) use **`https://delay.cloudflare.chaika.me`** (the shared backend),
  filtered to the `BunnyDelay` / `Perf` job types. The shared agent/colo data is identical on both hosts.
- **Public / browser fetches** — the graph components (`src/components/graph/*.js|jsx`, mounted `client:only` /
  `client:visible`) and SignalR realtime (`src/scripts/signalr-*.js`) — use **`https://api.bunny.chaika.me`** so all
  browser-facing API traffic stays within the Bunny stack. `api.bunny.chaika.me` serves the same `/v1` + `/v2`
  routes as the Cloudflare backend.
- **`jobmap.cloudflare.chaika.me` / `perfmap.cloudflare.chaika.me`** are a separate map-data service and stay on
  Cloudflare (no Bunny equivalent) — do not repoint these.

## Build + deploy

Full recipe: `newdeployment.txt`. Quickstart with the official CLI (`npm i -g @bunny.net/cli`):

```bash
pnpm build                                  # astro check && astro build → dist/server/entry.mjs + dist/client/*
# bundle the Deno SSR entry into one file (note BOTH externals):
npx esbuild ./dist/server/entry.mjs --bundle --outfile=index.mjs --format=esm --platform=neutral \
  --external:jsr:* --external:node:*
# one manual edit: swap the launch block `Deno.serve({ port, hostname }, handler)` → `Bunny.v1.serve(handler)`
bunny login                                 # browser/interactive
bunny scripts create <name> --type standalone   # the pull zone it creates provides the *.bunny.run hostname
bunny scripts deploy index.mjs <id>         # uploads + publishes
```

Static assets (`dist/client/*`) are **not** served by the script — for a full deploy they go in a storage zone
behind a `*.*` (match-none) edge rule that falls back to running the Edge Script. The committed `index.mjs` is the
deploy bundle.

**Deploying the script alone is not a full deploy.** Every build emits new hashed asset names
(`/_astro/<hash>.css|js`); without re-uploading `dist/client/*` the new HTML 404s its CSS/JS and the live site is
unstyled. The CLI has no storage command — upload via the Storage API (`storage.bunnycdn.com` + the zone's write
`AccessKey` from `bunny api GET /storagezone/<id>` → `.Password`). Full copy-paste procedure (clean delete + PUT
loop + verify) and the current prod IDs (script `24523`, storage zone `astro-action-delay-api`/`1031552`, domain
`delay.bunny.chaika.me`) are in `newdeployment.txt`.

## Runtime gotchas (Bunny Edge Scripting = Deno-based)

- **`node:child_process` is NOT supported** (other builtins — `fs`, `os`, `path`, `crypto`, `util`, `stream`,
  `events`, `url`, `buffer`, `process` — are). A failed top-level import means the module never finishes evaluating,
  so `Bunny.v1.serve(handler)` never registers and **Bunny returns an empty HTTP 400 on every route**.
- **Keep the no-op image service.** `astro.config.mjs` sets
  `image: { service: { entrypoint: 'astro/assets/services/noop' } }`. Without it, Astro bundles **`sharp`** (its
  default image service), which imports `node:child_process` (libvips/arch detection via `spawnSync`) → the 400
  above. The noop service skips build-time image optimization (images pass through unresized) — acceptable here.
- **esbuild needs `--external:node:*`** as well as `--external:jsr:*`; the build imports `node:` builtins and
  `--platform=neutral` can't resolve them otherwise.
- **`Bunny.v1.serve(handler)` is the correct primitive** — the Bunny SDK's `net.http.serve()` calls exactly this on
  the `bunny` runtime, so no SDK import is needed in the bundle.

### Debugging an empty-400 / load failure
1. Run the bundle under local Deno: `deno run -A index.mjs`. Reaching `ReferenceError: Bunny is not defined` means
   module load is fine and the problem is per-request; an earlier error is a load-time failure.
2. To test the handler offline, shim `globalThis.Bunny = { v1: { serve: (h) => globalThis.__h = h } }`, import the
   bundle, then invoke `__h(new Request(...))`.
3. To find which `node:` builtins the runtime supports, deploy a tiny script that `await import()`s each one inside
   the handler and returns the results.

## Verify

```bash
pnpm build                                  # 0 errors
curl -sS -D- https://<name>.bunny.run/ | head        # expect HTTP 200 + SSR HTML
curl -sS https://<name>.bunny.run/delay/ | grep -o "<title>[^<]*</title>"
```

Asset requests (`/_astro/*`, favicon) 404 on a script-only deploy — expected unless the storage zone is wired up.
