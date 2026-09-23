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
- `/compare` — put any two things on one axis (jobs, providers, models, regions). The only
  page backed by the **GraphQL** endpoint rather than the REST API; see "Comparison" below
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

- **`analytics.js`** — shared normalization for `/v2` analytics responses; every graph should
  read its series through it rather than mapping `points` directly. Exports `seriesFromResponse`
  (response → `[{x, y}]` for one metric), `completeBuckets` (raw points, filtered) and
  `metricKey`. It removes two classes of bad point:
  - the synthetic **in-flight run** point the API appends when a job is mid-run (`undeployed: true`,
    value = elapsed-so-far). It is not comparable to completed runs, and because `undeployed`
    serializes ahead of the metric properties, any "first key that isn't `timePeriod`" extraction
    reads `true` and plots a `1`.
  - **partial first/last buckets**. The ClickHouse queries bucket with `toStartOfInterval()` but
    filter `run_time > start and run_time < end`, so the edge buckets cover only part of the
    requested window and can be a single run. Identified via `groupByMinutesInterval`, which every
    analytics endpoint returns. Charts therefore lag by up to one bucket interval — intentional.
- **`SmartGraph.js`** — Preact/Plotly time-series graph. Props: `endpoint`, `label`, `options` (array of metric keys), `defaultOption`, `fullscreen`. Supports all run-length and API latency metrics plus `MedianEdgeResponseLatency` / `AvgEdgeResponseLatency` / `MinEdgeResponseLatency` / `MaxEdgeResponseLatency`. Shows `animate-pulse` skeleton while loading with no data yet. Zoom on plot triggers custom date range fetch.
- **`SmartGraphLazy.js`** — Lazy wrapper: renders a placeholder until a parent `<details>` is opened, then dynamically imports SmartGraph. Used on `/locations`. Props forwarded to SmartGraph plus `detailsId`.
- **`ErrorGraph.js`** — Preact/Plotly stacked bar chart for error occurrences. Shows skeleton while loading. Props: `endpoint`, `label`, `fullscreen`.
- **`RegionGraph.js`** — Preact/Plotly multi-line chart grouped by region (NA/EU/AS/OC/SA). Fetches 5 endpoints in parallel via `/v2/jobs/{jobName}/locations/region/{region}/analytics`. Shows skeleton while loading. Props: `jobName`, `label`, `defaultMetric`.
- **`RegionGraphLazy.js`** — Lazy wrapper for RegionGraph: fires no API calls until parent `<details>` is opened. Props forwarded to RegionGraph. Used on all job detail pages.

### Comparison (`/compare`, `src/lib/compare/`, `src/pages/api/compare*`)

The one part of the site that reads from **adp-proxy's GraphQL endpoint** instead of the
`/v2` REST API. REST has no way to ask for "A vs B on one aligned time axis"; GraphQL
answers it in a single request with one bucket width for every line.

The endpoint is `https://delay.cloudflare.chaika.me/graphql` — the same host and hostname as
the REST API. nginx routes that one path to adp-proxy on `127.0.0.1:8124`; everything else
on that host is the .NET API as before, and adp-proxy's other route is a ClickHouse SQL
passthrough that must never be exposed.

The browser never calls the endpoint — `/api/compare` does, server-side. That is why it
needs no CORS handling.

For local dev, copy `.env.example` to `.env` to point at a proxy on localhost. The override
is required rather than optional: wrangler's `[vars]` are loaded in `astro dev` too, so
`graphqlEndpoint()` prefers the `.env` value when `import.meta.env.DEV` — otherwise the
production URL would be unconditional and dev could never reach a local proxy.

**Regions are a filter, not a dimension.** There is no region column in ClickHouse. A
region series names that region's locations in `filters.locationName` and deliberately
does *not* select `locationName`, so adp-proxy groups by time alone and ClickHouse merges
the per-location `quantilesState`/`avgState` digests into each bucket. That yields a real
regional median. Selecting `locationName` instead would return one line per location and
leave the rollup to the browser, where medians cannot be averaged — the same reason
`RegionGraph` still uses the REST API's five per-region calls. Region membership comes
from `/v2/locations` grouped by **`friendlyRegionName`**, matching the backend's
`CacheSingletonService`. The sibling `region` field is the Cloudflare LB code (`weur`,
`enam`) and grouping on it silently produces empty series.

Seven regions are populated — AS, EU, NA, OC, SA, AF, ME — so one job split by region is
seven of the ten root fields `maxRootFields` allows, and two jobs will not fit.
`ManualBuilder` blocks that rather than letting the endpoint 400. Note the sizes are very
uneven (EU 24 locations, ME 1), so some "regional" medians rest on a single probe.

**Bucket alignment.** Tiered families snap to adp-proxy's interval ladder; tier-less ones
(`websocketMonitoring`, `yabs`) compute `ceil(span / maxPoints)`. Mixing them in one chart
gives e.g. 30-minute against 21-minute buckets with nothing on screen to say so. `gql.ts`
re-requests the narrower series at `span / widest` to land them on the same width, and
labels the intervals when it cannot converge.

**The AI is not a query author.** `/api/compare/interpret` has Workers AI emit a JSON
*spec*, which `validateSpec()` checks against `catalog.ts` before any document is built —
unknown families, metrics, ops and dimensions are rejected, never repaired. The model
never writes GraphQL, never names a table, and emits `rangeDays` rather than absolute
dates. `/api/compare/narrate` receives only the deterministic statistics from `facts.ts`,
never the point arrays, so every number it can quote was computed here.

Files: `catalog.ts` (the queryable surface + labels + the validation allowlist), `spec.ts`
(the request format and its validator), `gql.ts` (document, alignment, normalization),
`facts.ts` (deterministic stats), `presets.ts` (derived presets), `curated.ts` (hand-written
sets), `scale.ts` (axis + formatting decisions, kept out of the component so they are
testable), `CompareGraph.jsx` (chart), `CompareExplorer.jsx` (state).

**Presets are derived; curated sets are not.** `presets.ts` falls out of
`DELAY_CATEGORIES`, `perfVariant` and the region map, so it tracks the job list on its own.
`curated.ts` is for sets that exist because of what the sources *are* — the CI build
runners (`pages`, `workersbuilds`, `workersbuildsfree`, `githubactions`, `cfcontainers`),
the WebSocket comparisons — and adding one is a literal plus nothing else. Curated values
are checked against a cheap discovery query (`maxPoints:1` returns one row per distinct
source) so a renamed source drops its preset instead of rendering a blank chart.

**Perf presets group by variant, not category.** Category was too coarse: "Object Storage"
spans 45x because it puts an 8ms cached read next to a 356ms upload. The comparable axis is
(category, operation, variantLabel) from `perfVariant()` — same operation, payload and
region, across providers.

**Some things measured wrong until they were read against live data**, and the same traps
apply to anything added here:

- **Units.** The `yabs_results` columns are bare `UInt32`. `ram`, `disk`, `speedrw` and
  `iorw` are kilobytes, not MB/GB/IOPS — a `ram` of 12514296 is 11.9 GiB. Only the
  magnitudes reveal this.
- **Zero is sometimes missing data.** Those same non-nullable columns write `0` when a run
  produced no reading — 10 of 61 buckets for most CI runners. `MetricDef.zeroIsMissing`
  drops those points. Do **not** set it where zero is real: `startdelay` is genuinely 0 for
  cfcontainers, and error counts are 0 in a quiet bucket.
- **Constant columns.** `run_length` on both AI families is the literal value 1 in every
  bucket, so it is deliberately absent from `catalog.ts`. Inference time is the latency
  column.

**The y-axis goes logarithmic** above a 20x spread between series medians (`scale.ts`),
because Workers delay spans 119x and SSL 176x and a linear axis renders those as one line
at the top and the rest on the floor. Never when a non-positive value is present — Plotly
drops those points silently, and they are real.

`catalog.ts` mirrors adp-proxy's schema generation: a family's root field is its config
name lower-first, a metric field is `<op><Metric>`, a dimension is both a filter argument
and a point field. Adding a family to adp-proxy's `config.yaml` requires a matching entry
here.

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
- Bindings: `AI` (Workers AI) and the `ADP_GRAPHQL_URL` var, both used only by
  `/api/compare*`. Reach them with `import { env } from "cloudflare:workers"` —
  `Astro.locals.runtime.env` was removed in Astro v6 / `@astrojs/cloudflare` v13
- **The `AI` binding has no local emulation**, so the Cloudflare vite plugin opens a remote
  proxy session for it. That makes `wrangler login` (or `CLOUDFLARE_API_TOKEN`) a
  prerequisite for `pnpm dev`, `pnpm build` *and* `astro check` — anything that constructs
  the vite server, not just deploys
- Build output goes to `./dist`, with the worker entrypoint at `./dist/_worker.js/index.js`

