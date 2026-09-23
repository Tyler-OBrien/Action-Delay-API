import type { BenchmarkSource } from './benchmarks';
import type { Experiment } from './experiments';
import { measurement } from "./measurement";
import { sourceLabel } from "./labels";
// Turning a validated CompareSpec into a GraphQL document, running it, and
// normalizing the result into chart series.
//
// Every identifier written into the document comes from catalog.ts. Caller data
// (filter values, timestamps) travels as GraphQL *variables*, never spliced into
// the query text.

import { isCompleteBucket } from "../../components/graph/analytics.js";
import { OP_LABELS, findFamily, findMetric, pointField, type Unit, type Direction } from "./catalog";
import type { CompareSpec, CompareSeriesSpec } from "./spec";

export interface SeriesPoint {
  x: number;
  y: number;
  reports?: number;
}

export interface CompareSeries {
  key: string;
  sourceId: string;
  direction: Direction;
  comparisonKey: string;
  rankingEligible: boolean;
  measurementContext: string;
  experiment?: Experiment;
  benchmark?: BenchmarkSource;
  metricContext?: string;
  observationScope?: string;
  label: string;
  unit: Unit;
  /** Set when this line came from a `groupBy`, so the UI can color by region etc. */
  groupValue?: string;
  intervalMinutes: number;
  tier: string;
  points: SeriesPoint[];
}

export interface CompareResult {
  series: CompareSeries[];
  /** The interval every series is on, when they agree. */
  intervalMinutes: number | null;
  tiers: string[];
  warnings: string[];
}

interface BuiltQuery {
  query: string;
  variables: Record<string, unknown>;
  /** Alias -> the series spec it came from, in request order. */
  aliases: { alias: string; spec: CompareSeriesSpec }[];
}

/** Bare identifier check. Belt and braces: these already come from the catalog. */
const IDENT = /^[A-Za-z][A-Za-z0-9_]*$/;

function assertIdent(name: string, what: string): string {
  if (!IDENT.test(name)) throw new Error(`refusing to build a query with an unsafe ${what}: ${name}`);
  return name;
}

/**
 * Build one root field per series entry.
 *
 * A `groupBy` selects the dimension into the point, which makes adp-proxy add it
 * to the SQL GROUP BY and return one row per (bucket, value). Leaving it *out*
 * while still filtering on it is the other half of the trick: the query then
 * groups by time alone and ClickHouse merges every matching value's aggregate
 * state into each bucket. That is what makes a region series a real median
 * rather than an average of per-location medians.
 */
export function buildQuery(spec: CompareSpec, maxPointsOverride?: Map<string, number>): BuiltQuery {
  const variables: Record<string, unknown> = {
    from: spec.from,
    to: spec.to,
  };
  const varDefs = ["$from: Time!", "$to: Time!"];
  const aliases: { alias: string; spec: CompareSeriesSpec }[] = [];
  const rootFields: string[] = [];

  spec.series.forEach((s, i) => {
    const family = findFamily(s.family);
    const metric = family && findMetric(family, s.metric);
    const field = family && pointField(family, s.metric, s.op);
    if (!family || !metric || !field) {
      // validateSpec ran first, so this is a programming error, not user input.
      throw new Error(`series[${i}] did not survive validation: ${s.family}.${s.metric}.${s.op}`);
    }

    const alias = `s${i}`;
    const args = [`from: $from`, `to: $to`];

    const mpVar = `mp${i}`;
    variables[mpVar] = maxPointsOverride?.get(alias) ?? spec.maxPoints ?? 500;
    varDefs.push(`$${mpVar}: Int`);
    args.push(`maxPoints: $${mpVar}`);

    for (const [dim, values] of Object.entries(s.filters ?? {})) {
      const varName = `f${i}_${assertIdent(dim, "dimension")}`;
      variables[varName] = values;
      varDefs.push(`$${varName}: [String!]`);
      args.push(`${dim}: $${varName}`);
    }

    const pointFields = ["time"];
    if (s.groupBy) pointFields.push(assertIdent(s.groupBy, "dimension"));
    pointFields.push(assertIdent(field, "metric field"));

    rootFields.push(
      `  ${alias}: ${assertIdent(family.id, "family")}(${args.join(", ")}) {` +
        ` tier intervalMinutes points { ${pointFields.join(" ")} } }`
    );
    aliases.push({ alias, spec: s });
  });

  const query = `query Compare(${varDefs.join(", ")}) {\n${rootFields.join("\n")}\n}`;
  return { query, variables, aliases };
}

interface RawSeries {
  tier: string;
  intervalMinutes: number;
  points: Record<string, unknown>[];
}

async function execute(
  endpoint: string,
  built: BuiltQuery,
  fetchImpl: typeof fetch
): Promise<Record<string, RawSeries>> {
  const resp = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: built.query, variables: built.variables }),
  });

  const text = await resp.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`analytics endpoint returned a non-JSON response (HTTP ${resp.status})`);
  }

  // GraphQL reports field-level failures inside a 200 body, so the status alone
  // is not enough to tell success from failure.
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    throw new Error(json.errors.map((e: any) => e?.message ?? String(e)).join("; "));
  }
  if (!resp.ok) {
    throw new Error(`analytics endpoint returned HTTP ${resp.status}`);
  }
  if (!json.data) {
    throw new Error("analytics endpoint returned no data");
  }
  return json.data as Record<string, RawSeries>;
}

function defaultLabel(s: CompareSeriesSpec): string {
  const family = findFamily(s.family);
  const metric = family && findMetric(family, s.metric);
  const metricLabel = metric?.label ?? s.metric;
  const opLabel = OP_LABELS[s.op];
  // A count of errors reads as "Errors", not "Count of Errors".
  return s.op === "count" ? metricLabel : `${opLabel} ${metricLabel}`;
}

/**
 * Split one root field's rows into chart series and drop untrustworthy buckets.
 *
 * adp-proxy buckets with toStartOfInterval() but filters `>= from AND <= to`, so
 * the first and last buckets cover only part of the requested window — often a
 * single run, which reads as a spike at the edge of the chart. The existing REST
 * charts drop them for the same reason; isCompleteBucket is that shared rule.
 */
function toSeries(
  s: CompareSeriesSpec,
  raw: RawSeries,
  startMs: number,
  endMs: number,
  keyPrefix: string
): CompareSeries[] {
  const family = findFamily(s.family)!;
  const metric = findMetric(family, s.metric)!;
  const field = pointField(family, s.metric, s.op)!;
  const intervalMs = (raw.intervalMinutes ?? 0) * 60_000;

  // A metric whose zero means "not measured" must drop those points rather than
  // plot them: they are not a reading of zero, and both the line and the median
  // are wrong if they stay.
  const dropZero = metric.zeroIsMissing === true;

  const usable = (raw.points ?? []).filter((p) => {
    const t = Date.parse(String(p.time));
    if (!Number.isFinite(t)) return false;
    // Without an interval we cannot tell a partial bucket from a whole one, so
    // keep everything rather than silently emptying the chart.
    return !intervalMs || isCompleteBucket({ timePeriod: p.time }, intervalMs, startMs, endMs);
  });

  const base = {
    unit: metric.unit,
    direction: metric.direction,
    ...measurement(s.family, s.metric, s.op, (s.filters?.jobName ?? s.filters?.source ?? []).join(", "), s.filters?.locationName),
    sourceId: (s.filters?.jobName ?? s.filters?.source ?? []).join(", "),
    intervalMinutes: raw.intervalMinutes,
    tier: raw.tier,
  };

  if (!s.groupBy) {
    return [
      {
        ...base,
        key: keyPrefix,
        label: s.label ?? defaultLabel(s),
        points: usable
          .map((p) => ({ x: Date.parse(String(p.time)), y: (p[field] == null ? NaN : Number(p[field])) }))
          .filter((p) => Number.isFinite(p.y) && !(dropZero && p.y === 0)),
      },
    ];
  }

  const byValue = new Map<string, SeriesPoint[]>((s.filters?.[s.groupBy] ?? []).map((v) => [v, []]));
  for (const p of usable) {
    const value = String(p[s.groupBy] ?? "");
    const y = (p[field] == null ? NaN : Number(p[field]));
    if (!Number.isFinite(y)) continue;
    if (dropZero && y === 0) continue;
    const list = byValue.get(value) ?? [];
    list.push({ x: Date.parse(String(p.time)), y });
    byValue.set(value, list);
  }

  return [...byValue.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, points]) => ({
      ...base,
      key: `${keyPrefix}:${value}`,
      label: sourceLabel(s.family, value) || "(none)",
      sourceId: value,
      ...measurement(s.family, s.metric, s.op, value, s.filters?.locationName),
      groupValue: value,
      points,
    }));
}

/**
 * Bring every root field onto the same bucket width.
 *
 * Tiered families snap to the interval ladder (PickDataSet); tier-less ones
 * compute ceil(span / maxPoints) directly (RawOnlyChoice). Over 7 days at
 * maxPoints=500 that is 30 minutes against 21 — two lines on one axis whose
 * points never coincide, with nothing on screen to say so.
 *
 * Asking the narrower ones for `span / widest` points lands a computed interval
 * exactly on the widest. A tiered family can only land on a rung it has, so this
 * does not always converge; when it doesn't, the caller labels the intervals
 * instead of implying an alignment that isn't there.
 */
function planAlignment(
  data: Record<string, RawSeries>,
  spanMinutes: number
): { overrides: Map<string, number>; widest: number } | null {
  const intervals = Object.values(data).map((d) => d?.intervalMinutes ?? 0).filter((n) => n > 0);
  if (intervals.length < 2) return null;

  const widest = Math.max(...intervals);
  if (intervals.every((n) => n === widest)) return null;

  const overrides = new Map<string, number>();
  for (const [alias, d] of Object.entries(data)) {
    if ((d?.intervalMinutes ?? 0) < widest) {
      overrides.set(alias, Math.max(1, Math.ceil(spanMinutes / widest)));
    }
  }
  return overrides.size > 0 ? { overrides, widest } : null;
}

export async function runCompare(
  spec: CompareSpec,
  endpoint: string,
  fetchImpl: typeof fetch = fetch
): Promise<CompareResult> {
  const startMs = Date.parse(spec.from);
  const endMs = Date.parse(spec.to);
  const spanMinutes = (endMs - startMs) / 60_000;
  const warnings: string[] = [];

  const built = buildQuery(spec);
  let data = await execute(endpoint, built, fetchImpl);

  const alignment = planAlignment(data, spanMinutes);
  if (alignment) {
    // Re-request only the series that came back too fine-grained.
    const subsetIndexes = built.aliases
      .map((a, i) => (alignment.overrides.has(a.alias) ? i : -1))
      .filter((i) => i >= 0);
    const subset: CompareSpec = {
      ...spec,
      series: subsetIndexes.map((i) => spec.series[i]),
    };
    const overridesForSubset = new Map<string, number>();
    subsetIndexes.forEach((origIndex, newIndex) => {
      overridesForSubset.set(`s${newIndex}`, alignment.overrides.get(`s${origIndex}`)!);
    });

    try {
      const redone = await execute(endpoint, buildQuery(subset, overridesForSubset), fetchImpl);
      subsetIndexes.forEach((origIndex, newIndex) => {
        const got = redone[`s${newIndex}`];
        if (got) data = { ...data, [`s${origIndex}`]: got };
      });
    } catch (err) {
      // Alignment is an improvement, not a precondition. Render what we have.
      warnings.push(
        `Could not match reporting periods: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  const series: CompareSeries[] = [];
  for (const { alias, spec: s } of built.aliases) {
    const raw = data[alias];
    if (!raw) {
      warnings.push(`No data returned for ${s.label ?? defaultLabel(s)}`);
      series.push(...toSeries(s, { tier: "unknown", intervalMinutes: 0, points: [] }, startMs, endMs, alias));
      continue;
    }
    series.push(...toSeries(s, raw, startMs, endMs, alias));
  }

  const distinctIntervals = [...new Set(series.map((s) => s.intervalMinutes))];
  if (distinctIntervals.length > 1) {
    warnings.push(
      `Series summarize different time periods (${distinctIntervals
        .sort((a, b) => a - b)
        .map((n) => `${n}m`)
        .join(", ")}); points do not line up exactly.`
    );
  }

  return {
    series,
    intervalMinutes: distinctIntervals.length === 1 ? distinctIntervals[0] : null,
    tiers: [...new Set(series.map((s) => s.tier))],
    warnings,
  };
}
