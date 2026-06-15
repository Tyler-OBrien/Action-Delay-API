# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

This is the frontend website for Action-Delay-API — it displays real-time propagation delay metrics for Cloudflare and Bunny CDN configuration changes. It fetches data from the backend API at `https://delay.cloudflare.chaika.me` and receives live updates via SignalR WebSocket.

## Commands

All commands run from this directory using pnpm:

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server at localhost:4321
pnpm build            # Type-check + build to ./dist
pnpm preview          # Preview production build locally
pnpm pagespreview     # Preview via Wrangler (simulates CF Pages environment)
```

## Architecture

**Stack:** Astro 5 (SSR, server output) + Preact + Tailwind CSS, deployed to Cloudflare Workers via `@astrojs/cloudflare` adapter.

**Key architectural decisions:**
- Pages fetch data server-side at render time from the backend API, then pass it to the client via `define:vars` / `globalThis` for live updates
- Preact is used with React compat mode (`@astrojs/preact` with `compat: true`) — React imports work but resolve to Preact
- `plotly.js-basic-dist-min` is bundled inline (not external) due to SSR/Vite requirements — configured in `astro.config.mjs` under `vite.ssr.noExternal`
- All Preact graph components must use `client:only="preact"` directive

**Site sections:**
- `/` — landing page with monitoring type overview cards
- `/delay` — Cloudflare propagation delay jobs grid with filter, stats bar (overall analytics), incident badges
- `/delay/[internalJobName]` — job detail: run stats, SmartGraph (run + API latency), ErrorGraph, RegionGraphLazy, live location table
- `/delay/overview` — aggregated overview SmartGraph
- `/perf` — performance jobs grid with filter
- `/perf/[internalJobName]` — performance job detail with SmartGraph (API latency), ErrorGraph, location table, RegionGraphLazy
- `/ai` — Workers AI jobs grid with filter
- `/ai/[internalJobName]` — AI job detail with SmartGraph, ErrorGraph, location table, RegionGraphLazy
- `/ai/overview` — AI jobs overview SmartGraph
- `/status` — Cloudflare status
- `/locations` — full browser for edge agent locations: region-grouped table with IATA, provider, path-to-CF badge, CF latency; per-location expandable edge latency graph (SmartGraphLazy); text filter
- `/routing` — routing/colo data with `CloudflareRouting.jsx`
- `/graph/[...type]` — standalone fullscreen graph pages

## Component Patterns

### JobDisplay.astro
Card for a single job. Props: `job: Job`, `stats: QuickStats[]`, `type: string`, `hasIncident?: boolean`.
- Renders server-side with initial data; DOM IDs targeted by SignalR client JS for live updates:
  - `delayNumber${internalJobName}`, `delayUnit${internalJobName}`, `pending${internalJobName}`, `lastUpdate${internalJobName}`
  - `peak${internalJobName}`, `peak-period${internalJobName}`
  - `median1d${internalJobName}`, `median30d${internalJobName}`, `median${internalJobName}` (90d)
- Shows a red `Incident` badge (absolute top-right) when `hasIncident` is true
- Shows predicted delay line at bottom when `job.predictedDelayLengthMs > 0`
- Card outer div has `id="${internalJobName}grid"` — used by the filter script on listing pages

### Graph Components (`src/components/graph/`)

- **`SmartGraph.js`** — Preact/Plotly time-series graph. Props: `endpoint`, `label`, `options` (array of metric keys), `defaultOption`, `fullscreen`. Supports all run-length and API latency metrics plus `MedianEdgeResponseLatency` / `AvgEdgeResponseLatency` / `MinEdgeResponseLatency` / `MaxEdgeResponseLatency`. Shows `animate-pulse` skeleton while loading with no data yet. Zoom on plot triggers custom date range fetch.
- **`SmartGraphLazy.js`** — Lazy wrapper: renders a placeholder until a parent `<details>` is opened, then dynamically imports SmartGraph. Used on `/locations`. Props forwarded to SmartGraph plus `detailsId`.
- **`ErrorGraph.js`** — Preact/Plotly stacked bar chart for error occurrences. Shows skeleton while loading. Props: `endpoint`, `label`, `fullscreen`.
- **`RegionGraph.js`** — Preact/Plotly multi-line chart grouped by region (NA/EU/AS/OC/SA). Fetches 5 endpoints in parallel via `/v2/jobs/{jobName}/locations/region/{region}/analytics`. Shows skeleton while loading. Props: `jobName`, `label`, `defaultMetric`.
- **`RegionGraphLazy.js`** — Lazy wrapper for RegionGraph: fires no API calls until parent `<details>` is opened. Props forwarded to RegionGraph. Used on all job detail pages.

### Live Updates via SignalR
- `src/scripts/signalr-job-code.js` — individual job pages; subscribes to a single job; updates delay display and location table cells (`loc-status-{name}`, `loc-delay-{name}`, `loc-updated-{name}`)
- `src/scripts/signalr-delay-code.js` — delay listing page; handles multi-job updates including 1d/30d/90d median DOM cells
- `src/scripts/signalr-status-code.js` — status page
- SignalR connects to `https://delay.cloudflare.chaika.me/v2/jobs/signalr` (WebSockets + MessagePack)
- Job data is stored in `globalThis.jobData` / `globalThis.jobStats`

### Listing Page Filter
All three listing pages (`delay.astro`, `perf.astro`, `ai.astro`) have a filter `<input id="job-filter">` with an inline `<script>` that hides/shows `<li>` elements by matching `card.id` (which ends in `"grid"`) against the query.

## Models (`models/cloudflare/` and `models/`)

- `job.ts` — `Job` interface: `jobName`, `internalJobName`, `lastRunTime/LengthMs/Status`, `currentRunTime/LengthMs/Status`, **`predictedDelayLengthMs`**, **`predictedRunStatus`**, `predictedRunTime`, `jobDescription`, `type`
- `quickstat.ts` — `QuickStats` interface for `/v1/quick/QuickAnalytics` response
- `location.ts` — `JobLocation` interface for per-job location status (`/v2/jobs/{name}/locations`)
- `locationinfo.ts` — `LocationInfo` interface for the full location metadata (`/v2/locations`): includes `iata`, `friendlyLocationName`, `region`, `provider`, `asn`, `pathToCf`, `cfLatency`, `coloId`, `enabled`, lat/lng, etc.
- `colo.ts` — `ColoInfo` interface for `/v2/colos`: `ID`, `IATA`, `cfRegionLB`, `cfRegionDO`, `cfRegionR2`, `niceName`, `country`, `lat`, `long`
- `overallanalytics.ts` — `OverallAnalytics` interface for `/v2/jobs/OverallAnalytics`
- `types.ts` — `Incident` (`target`, `active`, `startedAt`, `endedAt`, `currentValue`, `thresholdValue`), `StatusConfig`, `Job`

## API Endpoints Used

All requests go to `https://delay.cloudflare.chaika.me`. Key endpoints:
- `GET /v2/jobs/type/{type}` — job list (CloudflareDelay, Perf, ai)
- `GET /v2/jobs/{name}` — single job `{ data: Job }`
- `GET /v2/jobs/{name}/locations` — per-location status `{ data: JobLocation[] }`
- `GET /v2/jobs/{name}/analytics` — time-series analytics
- `GET /v2/jobs/{name}/erroranalytics` — error occurrences
- `GET /v2/jobs/{name}/locations/region/{region}/analytics` — regional analytics (NA/EU/AS/OC/SA)
- `GET /v2/jobs/analytics/type/{type}` — job-type-level analytics (for overview pages)
- `GET /v2/jobs/OverallAnalytics` — overall stats (wrapped in `{ data: ... }`)
- `GET /v2/incidents/type/CloudflareDelay` — active/historical incidents `{ data: Incident[] }`
- `GET /v1/quick/QuickAnalytics/{jobName}` — 1d/30d/90d median stats
- `GET /v1/quick/QuickAnalytics/type/{type}` — same, for a whole job type
- `GET /v2/locations` — all edge agent locations `{ data: LocationInfo[] }`
- `GET /v2/colos` — Cloudflare PoP data (response uses `results` key, not `data`)
- `GET /v2/jobs/worker/locations/{locationName}/analytics` — per-location time-series (used on `/locations` page)

## Deployment

- Deploys to Cloudflare Workers (not Pages) via `wrangler.toml`
- Build output goes to `./dist`, with the worker entrypoint at `./dist/_worker.js/index.js`

