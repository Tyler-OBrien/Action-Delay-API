// The queryable surface of the adp-proxy GraphQL endpoint, as data.
//
// adp-proxy generates its schema from its own config.yaml, so this file mirrors
// that generation instead of duplicating its logic:
//   - a family's root field is its config name, lower-first
//   - a metric field is `<op><Metric>`, e.g. median + run_length -> medianRunLength
//   - a dimension is both a filter argument and a point field, lower-camel
//
// It exists for three reasons the endpoint's own introspection cannot serve:
//
//  1. **Labels.** The endpoint speaks column names. `response_latency` on
//     `job_runs` is what the rest of this site calls "API Response Time", while
//     the *same column name* on `job_runs_locations` is "Edge Response Time". A
//     bare `medianResponseLatency` is ambiguous without knowing its family.
//  2. **Units.** Everything is a bare number over the wire; only we know which
//     ones are milliseconds.
//  3. **A validation allowlist.** This is the set a CompareSpec is checked
//     against before any query is built, which is what keeps a model-authored
//     spec from reaching ClickHouse.

export type Op = "median" | "avg" | "min" | "max" | "count";

export const OP_LABELS: Record<Op, string> = {
  median: "Median",
  avg: "Average",
  min: "Min",
  max: "Max",
  count: "Count",
};

/**
 * How a value should be formatted. `ms` gets the site's duration formatter.
 *
 * `kb` / `kbps` exist because that is what the yabs_results columns actually
 * hold. The DDL stores bare UInt32 with no unit, and the live magnitudes settle
 * it: a `ram` of 12514296 is 11.9 GiB, not 11.9 TiB, and githubactions' `disk`
 * of 152272208 is 145 GiB, which matches a real runner. The formatter scales
 * them, so nothing renders as a seven-digit number.
 */
export type Unit = "ms" | "count" | "mhz" | "kb" | "kbps" | "iops" | "score";

export type Direction = "lower" | "higher" | "neutral";

export interface MetricDef {
  direction: Direction;
  id: string;
  label: string;
  unit: Unit;
  /** Ops this metric supports -> the GraphQL point field that serves each. */
  fields: Partial<Record<Op, string>>;
  /**
   * A stored 0 means "not measured", not "measured as zero".
   *
   * The yabs columns are non-nullable UInt32, so a run that did not produce a
   * Geekbench score writes 0 — which happens in 10 of 61 buckets for most CI
   * runners and 18 for cfcontainers. Plotted, that reads as a machine briefly
   * having no compute, and it drags the median toward zero.
   *
   * Also used for ambiguous zero startup timings: ingestion writes zero when
   * either timestamp is missing. This filters plotted values, not raw rows
   * contributing to a nonzero aggregate.
   */
  zeroIsMissing?: boolean;
}

export interface DimensionDef {
  id: string;
  label: string;
  /**
   * The rollups cannot answer this correctly, so adp-proxy falls back to the raw
   * table when it is selected or filtered. Queries stay correct but get slower
   * over wide ranges.
   */
  rawOnly?: boolean;
}

export interface FamilyDef {
  id: string;
  label: string;
  description: string;
  /**
   * The family has no materialized-view tiers. adp-proxy sizes its buckets with
   * RawOnlyChoice (ceil(span / maxPoints)) rather than snapping to the interval
   * ladder, so its interval will not line up with a tiered family's. See
   * alignSeries() in gql.ts.
   */
  rawOnly: boolean;
  metrics: MetricDef[];
  dimensions: DimensionDef[];
}

/** The four ops every tiered metric with a raw column supports. */
function fullOps(metric: string): Partial<Record<Op, string>> {
  const M = metric.charAt(0).toUpperCase() + metric.slice(1);
  return {
    median: `median${M}`,
    avg: `avg${M}`,
    min: `min${M}`,
    max: `max${M}`,
  };
}

const RUN_LENGTH: MetricDef = {
  id: "runLength",
  label: "Job Time",
  unit: "ms", direction: "lower",
  fields: fullOps("runLength"),
};

/** `response_latency` on a top-level job table: the control-plane API call. */
const API_LATENCY: MetricDef = {
  id: "responseLatency",
  label: "API Response Time",
  unit: "ms", direction: "lower",
  fields: fullOps("responseLatency"),
};

/** The same column name on a *locations* table means something different. */
const EDGE_LATENCY: MetricDef = {
  id: "responseLatency",
  label: "Edge Response Time",
  unit: "ms", direction: "lower",
  fields: fullOps("responseLatency"),
};

/** The AI and perf job tables name their latency column differently. */
const AVG_API_LATENCY: MetricDef = {
  id: "averageResponseLatency",
  label: "API Response Time",
  unit: "ms", direction: "lower",
  fields: fullOps("averageResponseLatency"),
};

const JOB_NAME: DimensionDef = { id: "jobName", label: "Job" };
const LOCATION_NAME: DimensionDef = { id: "locationName", label: "Probe location" };

// adp-proxy marks error_hash rawOnly because the api_errors MVs group by it but
// leave it out of their sorting key, so AggregatingMergeTree collapses distinct
// hashes. Selecting it forces the raw table.
const ERROR_HASH: DimensionDef = { id: "errorHash", label: "Error", rawOnly: true };

/**
 * adp-proxy generates a plain `count` point field for families with no MV tiers
 * (`hasRowCount`), because on a raw table a bucket's row count is meaningful.
 * Tiered families have no equivalent — there a row is a bucket, not an event.
 */
const ROW_COUNT: MetricDef = {
  id: "rows",
  label: "Observations",
  unit: "count", direction: "neutral",
  fields: { count: "count" },
};

/** Errors are a bucket count, not a measurement. */
const ERROR_COUNT: MetricDef = {
  id: "errors",
  label: "Errors",
  unit: "count", direction: "lower",
  fields: { count: "countErrors" },
};

export const FAMILIES: FamilyDef[] = [
  {
    id: "workersDelay",
    label: "Propagation delay",
    description: "Propagation delay for Cloudflare and Google configuration changes, per job.",
    rawOnly: false,
    metrics: [RUN_LENGTH, API_LATENCY],
    dimensions: [JOB_NAME],
  },
  {
    id: "workersDelayLocations",
    label: "Propagation delay by location",
    description: "The same jobs broken down by the edge location that observed the change.",
    rawOnly: false,
    metrics: [RUN_LENGTH, EDGE_LATENCY],
    dimensions: [JOB_NAME, LOCATION_NAME],
  },
  // run_length is deliberately absent from both AI families. The column exists,
  // but every row of it is the literal value 1 — checked across every model and
  // every bucket — so offering it only produces a flat line at y=1. Inference
  // time lives in the latency column.
  {
    id: "ai",
    label: "Workers AI",
    description: "Inference timings per model.",
    rawOnly: false,
    metrics: [AVG_API_LATENCY],
    dimensions: [JOB_NAME],
  },
  {
    id: "aiLocations",
    label: "Workers AI by Location",
    description: "Inference timings per model and edge location.",
    rawOnly: false,
    metrics: [EDGE_LATENCY],
    dimensions: [JOB_NAME, LOCATION_NAME],
  },
  {
    id: "perf",
    label: "Performance",
    description: "Cross-provider performance workloads (object storage, compute, ...).",
    rawOnly: false,
    metrics: [AVG_API_LATENCY],
    dimensions: [JOB_NAME],
  },
  {
    id: "perfLocations",
    label: "Performance by Location",
    description: "The same workloads broken down by edge location.",
    rawOnly: false,
    metrics: [EDGE_LATENCY],
    dimensions: [JOB_NAME, LOCATION_NAME],
  },
  {
    id: "apiErrors",
    label: "Cloudflare API Errors",
    description: "Error occurrences against the Cloudflare API.",
    rawOnly: false,
    metrics: [ERROR_COUNT, API_LATENCY],
    dimensions: [JOB_NAME, ERROR_HASH],
  },
  {
    id: "apiErrorsAi",
    label: "Workers AI Errors",
    description: "Error occurrences against Workers AI.",
    rawOnly: false,
    metrics: [ERROR_COUNT],
    dimensions: [JOB_NAME, ERROR_HASH],
  },
  {
    id: "apiErrorsPerf",
    label: "Performance Errors",
    description: "Error occurrences during performance workloads.",
    rawOnly: false,
    metrics: [ERROR_COUNT],
    dimensions: [JOB_NAME, LOCATION_NAME, ERROR_HASH],
  },
  {
    id: "websocketMonitoring",
    label: "WebSocket Monitoring",
    description: "Long-lived WebSocket connection duration and ping, per source.",
    rawOnly: true,
    metrics: [
      { id: "duration", label: "Connection Duration", unit: "ms", direction: "higher", fields: fullOps("duration") },
      { id: "avgping", label: "Average Ping", unit: "ms", direction: "lower", fields: fullOps("avgping") },
      ROW_COUNT,
    ],
    dimensions: [
      { id: "source", label: "Source" },
      { id: "closecode", label: "Close Code" },
    ],
  },
  {
    id: "yabs",
    label: "Server Benchmarks",
    description: "YABS hardware benchmark results, per source machine.",
    rawOnly: true,
    metrics: [
      { id: "freq", label: "CPU Frequency", unit: "mhz", direction: "higher", fields: fullOps("freq"), zeroIsMissing: true },
      { id: "ram", label: "RAM", unit: "kb", direction: "neutral", fields: fullOps("ram"), zeroIsMissing: true },
      { id: "disk", label: "Disk", unit: "kb", direction: "neutral", fields: fullOps("disk"), zeroIsMissing: true },
      { id: "speedrw", label: "4 KiB random read/write throughput", unit: "kbps", direction: "higher", fields: fullOps("speedrw"), zeroIsMissing: true },
      { id: "iorw", label: "4 KiB random read/write IOPS", unit: "iops", direction: "higher", fields: fullOps("iorw"), zeroIsMissing: true },
      { id: "geekbenchsingle", label: "Geekbench 6 single-core", unit: "score", direction: "higher", fields: fullOps("geekbenchsingle"), zeroIsMissing: true },
      { id: "geekbenchmulti", label: "Geekbench 6 multi-core", unit: "score", direction: "higher", fields: fullOps("geekbenchmulti"), zeroIsMissing: true },
      { id: "geekbench7single", label: "Geekbench 7 single-core", unit: "score", direction: "higher", fields: fullOps("geekbench7single"), zeroIsMissing: true },
      { id: "geekbench7multi", label: "Geekbench 7 multi-core", unit: "score", direction: "higher", fields: fullOps("geekbench7multi"), zeroIsMissing: true },
      { id: "startdelay", label: "Trigger to benchmark-script start", unit: "ms", direction: "lower", fields: fullOps("startdelay"), zeroIsMissing: true },
      ROW_COUNT,
    ],
    dimensions: [
      { id: "source", label: "Source" },
      { id: "colo", label: "Ingestion location" },
      { id: "cpumodel", label: "CPU Model" },
      { id: "distro", label: "Distro" },
      { id: "oskernel", label: "Kernel" },
    ],
  },
];

const FAMILY_BY_ID = new Map(FAMILIES.map((f) => [f.id, f]));

export function findFamily(id: string): FamilyDef | undefined {
  return FAMILY_BY_ID.get(id);
}

export function findMetric(family: FamilyDef, id: string): MetricDef | undefined {
  return family.metrics.find((m) => m.id === id);
}

export function findDimension(family: FamilyDef, id: string): DimensionDef | undefined {
  return family.dimensions.find((d) => d.id === id);
}

/** The GraphQL point field serving one (metric, op), or undefined if unsupported. */
export function pointField(family: FamilyDef, metricId: string, op: Op): string | undefined {
  return findMetric(family, metricId)?.fields[op];
}

/**
 * Server-side limits, mirrored from adp-proxy's config.yaml `graphql:` block.
 *
 * These are duplicated rather than discovered because the UI has to reason about
 * them *before* sending a request — refusing to build a 12-series comparison is
 * better than sending one and rendering a 400. If they drift, the endpoint stays
 * authoritative: it rejects, and we surface the error.
 */
export const LIMITS = {
  maxRootFields: 10,
  maxPoints: 5000,
  maxSpanDays: 400,
} as const;

/** Regions, in the order the rest of the site presents them (locations.astro). */
export const REGION_ORDER = ["NA", "EU", "AS", "OC", "SA", "AF", "ME"];

export const REGION_NAMES: Record<string, string> = {
  NA: "North America",
  EU: "Europe",
  AS: "Asia-Pacific",
  OC: "Oceania",
  SA: "South America",
  AF: "Africa",
  ME: "Middle East",
};
