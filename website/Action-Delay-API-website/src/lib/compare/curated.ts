import { CACHE_COMPARISONS } from "./caching";
// Hand-maintained comparison sets.
//
// The presets in presets.ts are *derived* — they fall out of DELAY_CATEGORIES,
// perfVariant and the region map, so they track the job list automatically. This
// file is for the ones no rule can find: a set of sources that belong together
// because of what they are, not because of how they are named.
//
// Adding one is a literal here plus nothing else. Entries are checked against
// the values actually present in the data before they are offered, so a renamed
// source drops its preset rather than rendering a blank chart.

import type { CompareSpec, CompareSeriesSpec } from "./spec";
import type { Op } from "./catalog";

export interface CuratedSet {
  id: string;
  group: string;
  label: string;
  description: string;
  family: string;
  topic?: string;
  breakdown?: string;
  service?: string;
  /** Dimension the values below belong to (`source`, `jobName`, ...). */
  dimension: string;
  values: string[];
  /**
   * Metrics to offer, first one default. Several of these sets are only
   * interesting *because* the ranking changes with the metric, so they are
   * listed rather than fixed.
   */
  metrics: { metric: string; op: Op; label: string }[];
  /**
   * Window in days. Tier-less families (yabs, websocketMonitoring) are sampled
   * sporadically and need a much wider window than the 7 days the delay and perf
   * presets use, or the chart comes back empty.
   */
  days: number;
}

export const CURATED: CuratedSet[] = [
  ...CACHE_COMPARISONS.map(c => ({
    id: c.id, topic: c.topic, breakdown: 'Caching', service: c.service,
    group: 'Caching & data access', label: c.label, description: `${c.description} ${c.context}`,
    family: 'perfLocations', dimension: 'jobName', values: c.sources.map(s => s.id),
    metrics: [{ metric: 'responseLatency', op: 'median' as const, label: 'Response time' }], days: 7,
  })),
  {
    id: "yabs-ci-runners",
    group: "Server Benchmarks",
    label: "CI build runners",
    description:
      "The machines behind Pages, Workers Builds, GitHub Actions, Blacksmith and Cloudflare Containers. " +
      "Compare CPU scores, disk performance and startup timing across build environments.",
    family: "yabs",
    dimension: "source",
    values: ["pages", "workersbuilds", "workersbuildsfree", "githubactions", "blacksmith", "cfcontainers"],
    metrics: [
      { metric: "geekbenchmulti", op: "median", label: "Geekbench 6 multi-core" },
      { metric: "geekbenchsingle", op: "median", label: "Geekbench 6 single-core" },
      { metric: "geekbench7multi", op: "median", label: "Geekbench 7 multi-core" },
      { metric: "geekbench7single", op: "median", label: "Geekbench 7 single-core" },
      { metric: "freq", op: "median", label: "CPU frequency" },
      { metric: "ram", op: "median", label: "RAM" },
      { metric: "disk", op: "median", label: "Disk size" },
      { metric: "speedrw", op: "median", label: "4 KiB random read/write throughput" },
      { metric: "iorw", op: "median", label: "4 KiB random read/write IOPS" },
      { metric: "startdelay", op: "median", label: "Trigger to benchmark-script start" },
    ],
    days: 180,
  },
  {
    id: "ws-hibernation",
    group: "WebSocket",
    label: "Hibernation vs standard",
    description:
      "Recorded ping for hibernating and standard Durable Object WebSockets in western and eastern Europe. This measures neither billing cost nor isolated wake-up latency.",
    family: "websocketMonitoring",
    dimension: "source",
    values: [
      "Cloudflare-DurableObjects-Websocket-weur",
      "Cloudflare-DurableObjects-Hibernation-weur",
      "Cloudflare-DurableObjects-Websocket-eeur",
      "Cloudflare-DurableObjects-Hibernation-eeur",
    ],
    metrics: [{ metric: "avgping", op: "median", label: "Ping" }],
    days: 30,
  },
  {
    id: "ws-free-vs-paid",
    group: "WebSocket",
    label: "Free vs paid",
    description:
      "How does Durable Object WebSocket ping compare between free and paid plans?",
    family: "websocketMonitoring",
    dimension: "source",
    values: [
      "Cloudflare-DurableObjects-Websocket-weur",
      "Cloudflare-DurableObjects-Websocket-Free-weur",
      "Cloudflare-DurableObjects-Hibernation-weur",
      "Cloudflare-DurableObjects-Hibernation-Free-weur",
    ],
    metrics: [{ metric: "avgping", op: "median", label: "Ping" }],
    days: 30,
  },
  {
    id: "ws-stability",
    group: "WebSocket",
    label: "Connection lifetime",
    description:
      "Median lifetime of connections reported during the selected window, across providers and plans.",
    family: "websocketMonitoring",
    dimension: "source",
    values: ["Cloudflare", "Cloudflare-free", "Bunny", "Cloudflare-Worker-Proxy", "Cloudflare-Worker-Proxy-Free", "AWS-CloudFront", "Google-LB"],
    metrics: [{ metric: "duration", op: "median", label: "Connection duration" }],
    days: 30,
  },
];

/**
 * Turn a curated set into a spec, keeping only values that exist upstream.
 *
 * `available` is the set of dimension values seen in the data. A curated list is
 * a literal written by hand, so it goes stale silently when a source is renamed;
 * filtering here means the preset disappears rather than rendering an empty
 * chart that looks like a bug in the query layer.
 */
export function curatedSpec(
  set: CuratedSet,
  available: Set<string> | null,
  metricIndex = 0,
  now = Date.now()
): CompareSpec | null {
  const values = available ? set.values.filter((v) => available.has(v)) : set.values;
  if (values.length < 2) return null;

  const choice = set.metrics[metricIndex] ?? set.metrics[0];
  const series: CompareSeriesSpec = {
    family: set.family,
    metric: choice.metric,
    op: choice.op,
    groupBy: set.dimension,
    filters: { [set.dimension]: values },
  };

  return {
    title: `${set.label} — ${choice.label}`,
    from: new Date(now - set.days * 86_400_000).toISOString(),
    to: new Date(now).toISOString(),
    series: [series],
  };
}

/**
 * Which dimension values a family currently has.
 *
 * One bucket covering the whole window (maxPoints:1) returns one row per
 * distinct value, which is the cheapest way to ask "what sources exist" of an
 * endpoint that has no discovery query.
 */
export function discoveryQuery(sets: CuratedSet[], now = Date.now()): string | null {
  const byFamily = new Map<string, { dimension: string; days: number }>();
  for (const s of sets) {
    const prev = byFamily.get(s.family);
    // Keep the first set's dimension, matching how discoveryResult resolves it.
    // Taking the last would let two sets on one family disagree about which
    // column the discovered values came from.
    byFamily.set(s.family, {
      dimension: prev?.dimension ?? s.dimension,
      days: Math.max(prev?.days ?? 0, s.days),
    });
  }
  if (byFamily.size === 0) return null;

  const roots = [...byFamily.entries()].map(([family, { dimension, days }], i) => {
    const from = new Date(now - days * 86_400_000).toISOString();
    const to = new Date(now).toISOString();
    return `d${i}: ${family}(from:"${from}", to:"${to}", maxPoints:1) { points { ${dimension} } }`;
  });
  return `{ ${roots.join(" ")} }`;
}

/** Map the discovery response back onto families, in the same order. */
export function discoveryResult(data: Record<string, any>, sets: CuratedSet[]): Map<string, Set<string>> {
  const families = [...new Set(sets.map((s) => s.family))];
  const out = new Map<string, Set<string>>();
  families.forEach((family, i) => {
    const rows = data?.[`d${i}`]?.points ?? [];
    const dimension = sets.find((s) => s.family === family)!.dimension;
    const values = new Set<string>();
    for (const row of rows) {
      const v = row?.[dimension];
      if (typeof v === "string" && v) values.add(v);
    }
    out.set(family, values);
  });
  return out;
}
