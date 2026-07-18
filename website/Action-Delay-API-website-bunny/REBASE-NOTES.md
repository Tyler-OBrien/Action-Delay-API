# Bunny site re-base onto current main — notes / TODO

The Bunny site was re-based on the current (modernized) main website, keeping the Deno runtime and Bunny
customizations. **This was done in the repo only and is NOT build-verified** (no Deno/install here). Finish +
verify in your environment.

## What was done (repo-side)

- **`src/` replaced with current main's** (all the modernization + this session's fixes), preserving Bunny-only
  files: `CallToAction.astro`, `MonitoringTypeCard.astro`, `Skills.astro`, `new-test.astro`, and your deploy
  files (`index.mjs`, `deployment.txt`, `newdeployment.txt`, `patches/`, `public/`).
- **Dropped AI** (`src/pages/ai.astro`, `src/pages/ai/`). Kept delay, status, job, perf, locations, routing,
  graph, about, cloudflareapi.
- **Data source → Bunny:** `CloudflareDelay` → `BunnyDelay` everywhere; signalr scripts now point at
  `https://api.bunny.chaika.me`. Pages/analytics still use `https://delay.cloudflare.chaika.me` with the
  `BunnyDelay` type (matches how the old Bunny site fetched). Perf uses the same `type/Perf` endpoint as main.
- **`src/data/jobCategories.ts`:** `DELAY_CATEGORIES` rewritten for the 5 Bunny delay jobs (bunnydns,
  bunnyedgerule, bunnyedgescript, bunnystoragereplication, bunnylogforwarder) → DNS / Edge / Storage / Logging.
  (Perf grouping is unchanged — same Perf jobs as main.)
- **`src/components/Nav.astro`:** Bunny labels (Bunny Status / Bunny Delay / Bunny Performance), AI link
  removed, kept Routing/Locations/About.
- **`src/pages/about.astro`:** kept your Bunny copy (not overwritten).
- **`astro.config.mjs`:** kept `deno()` adapter; added `plotly.js-geo-dist-min` to `noExternal` (routing/
  locations need it).
- **`package.json`:** Astro 6 + preact 5 + check 0.9.9; `@deno/astro-adapter` bumped `^0.3.1 → ^0.5.2` (the
  version that declares `astro@^6`); added `plotly.js-geo-dist-min`; kept `shiki`; removed
  `@astrojs/cloudflare`/`wrangler` and the `pagespreview` script.
- Copied main's `tsconfig.json` + `tailwind.config.mjs`.

## Already done + verified

- **Adapter patch re-created for 0.5.2:** `patches/@deno__astro-adapter@0.5.2.patch` (the old 0.3.1
  `@deno__astro-adapter.patch` was removed). It re-applies both Bunny tweaks to 0.5.2's `src/server.ts`:
  client IP from `x-real-ip`, and dropping the static-file/prerender fallback (any unmatched route just renders
  astro). Registered in `pnpm-workspace.yaml` under `patchedDependencies`.
- **Models copied:** `models/cloudflare/*` (bunny was missing `location`/`colo`/`locationinfo`/`overallanalytics`).
- **`pnpm-workspace.yaml`** added (pnpm 11 reads settings here, not the package.json `pnpm` field which was
  removed): `allowBuilds` (esbuild/sharp), `minimumReleaseAgeExclude: [astro@6.4.7]`, `patchedDependencies`.
- **Build + type-check pass** under Astro 6 + `@deno/astro-adapter@0.5.2` with the patch applied:
  `astro check` → 0 errors; `astro build` → completes, output `dist/client` + `dist/server/entry.mjs` (deno target).
- **Runtime-verified on Bunny Edge Scripting** (via the new `@bunny.net/cli`): a fresh bundle deployed to a
  standalone script renders all SSR routes (`/`, `/delay/`, `/perf/`, `/locations/`, `/status`) with HTTP 200 and
  live job data. Static assets 404 (script-only deploy — they need the storage zone + `*.*` edge rule).
- **Image-service fix (REQUIRED for Bunny):** `astro.config.mjs` now sets the no-op image service
  `image: { service: { entrypoint: 'astro/assets/services/noop' } }`. Without it, Astro bundles `sharp`, which
  imports `node:child_process` — unsupported on Bunny's Deno runtime — so the module fails to load and Bunny returns
  an empty HTTP 400 on every route. See `CLAUDE.md` / `newdeployment.txt` for the full gotcha + debugging steps.

## ⚠️ Regenerate `index.mjs` before deploying (most important)

The committed `index.mjs` (722 KB) is your **final Bunny Edge Scripting deploy bundle** per
`deployment.txt`/`newdeployment.txt`, and it is **STALE** (old Astro-5 build, `C:\Users\chaik\…` paths). If you
deploy as-is, Bunny ships the old site. Regenerate it from this build:

1. `pnpm install --config.minimumReleaseAge=0` (see note below), then `pnpm build` (Astro 6 + Deno adapter).
2. `npx esbuild ./dist/server/entry.mjs --bundle --outfile=index.mjs --format=esm --platform=neutral --external:jsr:* --external:node:*`
   (the `--external:node:*` is required now — the build imports node: builtins).
3. Hand-edit `index.mjs` per `deployment.txt` step 4 — but **the re-created adapter patch already removed the
   `jsr:` `serveFile`/`fromFileUrl` imports + the static-file fallback** at adapter-source level, so that part
   is mostly done in the bundle; the only remaining manual edit is swapping the launch code to
   `Bunny.v1.serve(handler)` (instead of `Deno.serve`).
4. Deploy with `bunny scripts deploy index.mjs <id>` (new CLI), then upload `dist/client/*` to the storage zone; the
   `*.*` match-none edge rule routes extension-less paths to the Edge Script.

## You should still do

1. **pnpm release-age policy:** a fresh `pnpm install` currently trips pnpm 11's `minimumReleaseAge` on a few
   transient deps published in the last day (`@preact/signals*`, `electron-to-chromium`). I installed with
   `--config.minimumReleaseAge=0`; either use that, add those to `minimumReleaseAgeExclude`, or just wait a day.
2. ~~Runtime smoke test on Bunny Edge Scripting~~ — **done** (SSR routes 200 via the new CLI; see "Already done +
   verified"). Remaining for a full prod deploy: upload `dist/client/*` to the storage zone behind the `*.*`
   match-none edge rule so the page is styled and the graphs load.

## Verified during review (no action needed)

- **Data wiring** matches Bunny's original split: SSR pages + graph components → `delay.cloudflare.chaika.me`
  (`BunnyDelay`/`Perf`); signalr → `api.bunny.chaika.me`. No leftover `CloudflareDelay`; `jobmap`/`perfmap`
  preserved.
- **`locations` page** uses `delay.cloudflare.chaika.me/v2/locations` + `/v2/colos` — confirmed **identical**
  data to `api.bunny` (58 locations / 799 colos), so the shared host is fine.
- **`public/` assets** are fine — the 3 missing `cloudflare-*.svg` are not referenced; signalr JS + favicons
  present. (Only `src/` + `models/` were copied; your `public/` was kept.)
- A few graph components are now unused (`SmartGraphLazy`, `LocationGraph(Lazy)`, `SuccessRateGraph(Lazy)`,
  `OriginalSmartGraph`) — harmless (tree-shaken); delete only for tidiness.
- **Optional:** re-tune the Bunny `DELAY_CATEGORIES` grouping/labels to taste.

## Revert

All changes are confined to this folder; `git checkout -- website/Action-Delay-API-website-bunny` (and restore
deleted `ai/` if needed) reverts everything.
