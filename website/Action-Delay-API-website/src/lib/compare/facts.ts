import type { BenchmarkSource } from './benchmarks';
import type { Experiment } from './experiments';
import { EXPERIMENT_COMPARISONS } from './experimentComparisons';
import { cachingComparison } from "./caching";
// Deterministic summary of a comparison.
//
// This is the only thing the narration model ever sees. It never receives the
// point arrays, which keeps the prompt small and, more importantly, means every
// number it can quote was computed here rather than eyeballed off a series.
//
// One honesty note that the prompt repeats to the model: these are statistics
// **over bucket values**, not over the underlying events. The typical value of a
// "Median Job Time" series is the median of per-bucket medians — fine for "A
// usually sits above B", wrong for "the median run took X". The wording in
// `describe` is chosen to stay on the right side of that.

import type { CompareSeries } from "./gql";
import type { Unit, Direction } from "./catalog";

export interface SeriesFacts {
  label: string;
  sourceId: string;
  direction: Direction;
  comparisonKey: string;
  rankingEligible: boolean;
  measurementContext: string;
  experiment?: Experiment;
  benchmark?: BenchmarkSource;
  metricContext?: string;
  observationScope?: string;
  p10: number | null;
  p90: number | null;
  unit: Unit;
  tier: string;
  intervalMinutes: number;
  /** Buckets actually plotted. */
  buckets: number;
  min: number | null;
  max: number | null;
  /** Median of the bucket values. */
  typical: number | null;
  mean: number | null;
  first: number | null;
  last: number | null;
  /** Percent change from the first bucket to the last, when both exist. */
  trendPercent: number | null;
}

export interface PairFact {
  a: string;
  b: string;
  /** `typical(a) - typical(b)`, in the series' unit. */
  difference: number | null;
  /** How much larger a is than b, as a percentage of b. */
  percent: number | null;
  /** Buckets where both series have a value, and the share where a exceeded b. */
  overlappingBuckets: number;
  aHigherShare: number | null;
}

export interface CompareFacts {
  from: string;
  to: string;
  spanHours: number;
  series: SeriesFacts[];
  pairs: PairFact[];
  /** True when the series are not all on the same bucket width. */
  mixedIntervals: boolean;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function round(n: number | null, places = 2): number | null {
  if (n === null || !Number.isFinite(n)) return null;
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function seriesFacts(s: CompareSeries): SeriesFacts {
  const ys = s.points.map((p) => p.y).filter((y) => Number.isFinite(y));
  const first = s.points.length ? s.points[0].y : null;
  const last = s.points.length ? s.points[s.points.length - 1].y : null;

  return {
    label: s.label,
    sourceId: s.sourceId,
    direction: s.direction,
    comparisonKey: s.comparisonKey,
    rankingEligible: s.rankingEligible,
    measurementContext: s.measurementContext,
    experiment: s.experiment,
    benchmark: s.benchmark,
    metricContext: s.metricContext,
    observationScope: s.observationScope,
    p10: quantile(ys, 0.1),
    p90: quantile(ys, 0.9),
    unit: s.unit,
    tier: s.tier,
    intervalMinutes: s.intervalMinutes,
    buckets: ys.length,
    min: ys.length ? round(Math.min(...ys)) : null,
    max: ys.length ? round(Math.max(...ys)) : null,
    typical: round(median(ys)),
    mean: ys.length ? round(ys.reduce((a, b) => a + b, 0) / ys.length) : null,
    first: round(first),
    last: round(last),
    trendPercent:
      first !== null && last !== null && first !== 0 ? round(((last - first) / first) * 100, 1) : null,
  };
}

/**
 * Compare two series bucket by bucket.
 *
 * Aligning on the timestamp rather than the array index matters: a series can be
 * missing buckets where a job did not run, so index `i` is not the same instant
 * in both.
 */
function pairFact(a: CompareSeries, b: CompareSeries): PairFact {
  const bByTime = new Map(b.points.map((p) => [p.x, p.y]));
  let overlapping = 0;
  let aHigher = 0;
  for (const p of a.points) {
    const other = bByTime.get(p.x);
    if (other === undefined) continue;
    overlapping++;
    if (p.y > other) aHigher++;
  }

  const ta = median(a.points.map((p) => p.y));
  const tb = median(b.points.map((p) => p.y));

  return {
    a: a.label,
    b: b.label,
    difference: ta !== null && tb !== null ? round(ta - tb) : null,
    percent: ta !== null && tb !== null && tb !== 0 ? round(((ta - tb) / tb) * 100, 1) : null,
    overlappingBuckets: overlapping,
    aHigherShare: overlapping ? round(aHigher / overlapping, 3) : null,
  };
}

/**
 * Pairwise comparisons are quadratic, and at ten series that is 45 pairs of
 * prompt for a model that will mention two of them. Everything against the first
 * series answers the question people actually asked ("how do these compare to
 * X?") in linear space.
 */
export function computeFacts(
  series: CompareSeries[],
  from: string,
  to: string
): CompareFacts {
  const registered = series.length >= 2 && new Set(series.map(s=>s.sourceId)).size === series.length &&
    new Set(series.map(s=>s.observationScope)).size === 1 && series.every(s=>s.observationScope && /^perf:(averageResponseLatency|responseLatency):median:/.test(s.comparisonKey))
    ? EXPERIMENT_COMPARISONS.find(c=>!c.descriptive && series.every(s=>c.sources.includes(s.sourceId))) : undefined;
  if (registered) series = series.map(s=>({...s, comparisonKey:`experiment:${registered.id}:${s.observationScope}`, measurementContext:`${registered.description} ${s.measurementContext}`}));
  const caching = cachingComparison(series);
  if (caching) series = series.map(s => ({ ...s, comparisonKey: `perf:averageResponseLatency:median:${caching.id}`, measurementContext: `${caching.context} ${s.measurementContext}` }));
  const pairs: PairFact[] = [];
  for (let i = 1; i < series.length; i++) {
    if (series[i].unit === series[0].unit && series[i].comparisonKey === series[0].comparisonKey) pairs.push(pairFact(series[i], series[0]));
  }

  return {
    from,
    to,
    spanHours: round((Date.parse(to) - Date.parse(from)) / 3_600_000, 1) ?? 0,
    series: series.map(seriesFacts),
    pairs,
    mixedIntervals: new Set(series.map((s) => s.intervalMinutes)).size > 1,
  };
}

export function quantile(values: number[], q: number): number | null {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * q, lo = Math.floor(i);
  return sorted[lo] + (sorted[Math.ceil(i)] - sorted[lo]) * (i - lo);
}

export function highlights(facts: CompareFacts | null) {
  const series = facts?.series ?? [];
  const comparable = series.length >= 2 && !facts?.mixedIntervals && series.every(s =>
    s.rankingEligible === true && s.buckets >= 5 && s.typical !== null && Number.isFinite(s.typical) &&
    s.direction !== "neutral" && s.direction === series[0].direction &&
    s.unit === series[0].unit && s.comparisonKey === series[0].comparisonKey) &&
    (facts?.pairs ?? []).every(p => p.overlappingBuckets >= 5);
  if (!comparable) return null;
  const ranked = series.map((s, index) => ({ ...s, index })).sort((a, b) =>
    (a.typical! - b.typical!) * (a.direction === "higher" ? -1 : 1));
  const best = ranked.filter(s => s.typical === ranked[0].typical);
  const widths = series.map(s => s.p10 !== null && s.p90 !== null ? s.p90 - s.p10 : Infinity);
  const narrowest = Math.min(...widths);
  const low = Math.min(...series.map(s => s.typical!));
  const spread = Math.max(...series.map(s => s.typical!)) - low;
  return { ranked, best, spread, weakSeparation: spread === 0 || (low > 0 && spread / low < 0.02),
    consistent: series.filter((s, i) => Number.isFinite(narrowest) && widths[i] === narrowest) };
}
