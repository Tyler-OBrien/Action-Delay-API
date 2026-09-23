import { PROPAGATION_COMPARISONS, PROPAGATION_JOBS } from './propagation';
import { experiment, type Experiment } from './experiments';
import { EXPERIMENT_COMPARISONS, experimentSpec } from './experimentComparisons';
import { sourceLabel } from "./labels";
import {
  DELAY_CATEGORIES,
  HIDDEN_JOBS,
  isPopularAiModel,
  type JobLike,
} from "../../data/jobCategories";
import { REGION_NAMES, REGION_ORDER } from "./catalog";
import { CURATED, curatedSpec, type CuratedSet } from "./curated";
import type { CompareSpec } from "./spec";

export interface Preset {
  id: string;
  group: string;
  label: string;
  description: string;
  spec: CompareSpec;
  /** Set when this came from CURATED, so the UI can offer its metric switch. */
  curatedId?: string;
  topic: string;
  breakdown: string;
  service?: string;
  experiments?: Experiment[];
}

export interface PresetContext {
  delayJobs: JobLike[];
  perfJobs: JobLike[];
  aiJobs: JobLike[];
  /** friendlyRegionName -> location names, as the backend groups them. */
  locationsByRegion: Map<string, string[]>;
}

const DEFAULT_DAYS = 7;

/** Presets open on a 7-day window: wide enough to show a trend, still on m30. */
export function defaultRange(days = DEFAULT_DAYS, now = Date.now()) {
  return {
    from: new Date(now - days * 86_400_000).toISOString(),
    to: new Date(now).toISOString(),
  };
}

/**
 * Regions are location filters, not a dimension.
 *
 * Each series names one region's locations and does *not* select locationName,
 * so adp-proxy groups by time alone and ClickHouse merges those locations'
 * aggregate states into each bucket — a real regional median. Selecting
 * locationName instead would return one line per location and leave the
 * regional rollup to the browser, where medians cannot be averaged.
 */
export function regionSpec(
  internalJobName: string,
  locationsByRegion: Map<string, string[]>,
  opts: { family?: "workersDelayLocations" | "perfLocations" | "aiLocations"; metric?: string; days?: number } = {}
): CompareSpec | null {
  const family = opts.family ?? "workersDelayLocations";
  const metric = opts.metric ?? (family === "perfLocations" ? "responseLatency" : "runLength");

  const regions = REGION_ORDER.filter((r) => (locationsByRegion.get(r)?.length ?? 0) > 0);
  if (regions.length < 2) return null;

  return {
    title: `${sourceLabel(family, internalJobName)} by region`,
    ...defaultRange(opts.days),
    series: regions.map((region) => ({
      family,
      metric,
      op: "median" as const,
      label: REGION_NAMES[region] ?? region,
      filters: {
        jobName: [internalJobName],
        locationName: locationsByRegion.get(region)!,
      },
    })),
  };
}

/** Several jobs of one family on one axis: a single root field, grouped. */
function jobGroupSpec(
  family: string,
  metric: string,
  jobs: string[],
  title: string,
  days = DEFAULT_DAYS
): CompareSpec {
  return {
    title,
    ...defaultRange(days),
    series: [
      {
        family,
        metric,
        op: "median",
        groupBy: "jobName",
        filters: { jobName: jobs },
      },
    ],
  };
}

function visible(jobs: JobLike[]): JobLike[] {
  return jobs.filter((j) => !HIDDEN_JOBS.has(j.internalJobName));
}

export function buildPresets(ctx: PresetContext): Preset[] {
  const presets: Preset[] = [];

  // --- Delay categories -----------------------------------------------------
  const delayNames = new Set(visible(ctx.delayJobs).map((j) => j.internalJobName));
  for (const comparison of PROPAGATION_COMPARISONS) {
    const jobs = comparison.jobs.filter(id => delayNames.has(id));
    if (!jobs.some(id => id.startsWith('google')) || !jobs.some(id => !id.startsWith('google'))) continue;
    if (comparison.id === 'propagation-google-cloudflare' && new Set(jobs.map(id=>PROPAGATION_JOBS[id].purpose)).size < 2) continue;
    presets.push({id:comparison.id, topic:'propagation', group:'Propagation', breakdown:comparison.label,
      label:comparison.label, description:comparison.description,
      spec:jobGroupSpec('workersDelay','runLength',jobs,comparison.label)});
  }
  for (const cat of DELAY_CATEGORIES) {
    const members = cat.items.map((i) => i.jobName).filter((n) => delayNames.has(n) && n !== "cron");
    if (members.length < 2) continue;
    presets.push({
      id: `delay-${cat.key}`,
      topic: "propagation", breakdown: cat.name,
      group: "Cloudflare Delay",
      label: cat.name,
      description: `Median propagation delay across the ${members.length} ${cat.name} jobs.`,
      spec: jobGroupSpec("workersDelay", "runLength", members, cat.name),
    });
  }

  if (delayNames.has("cron")) presets.push({
    id: "delay-cron", topic: "propagation", breakdown: "Scheduled execution",
    group: "Cloudflare Delay", label: "Scheduled execution",
    description: "Workers Cron runs once per minute. Job time includes that cadence, not just scheduler lateness.",
    spec: jobGroupSpec("workersDelay", "runLength", ["cron"], "Workers Cron · once-per-minute schedule"),
  });

  const availablePerf = new Set(visible(ctx.perfJobs).map(j=>j.internalJobName));
  for (const c of EXPERIMENT_COMPARISONS) {
    const spec = experimentSpec(c, availablePerf);
    if (spec) presets.push({id:c.id,topic:c.topic,group:'Performance',label:c.label,description:c.description,breakdown:c.breakdown,spec,experiments:spec.series.flatMap(s=>(s.filters?.jobName ?? []).flatMap(id=>experiment(id) ? [experiment(id)!] : []))});
  }

  // --- AI: the models the /ai page already promotes --------------------------
  const popular = visible(ctx.aiJobs).filter(isPopularAiModel);
  if (popular.length >= 2) {
    presets.push({
      id: "ai-popular",
      topic: "ai", breakdown: "Models",
      group: "Workers AI",
      label: "Popular models",
      description: `Median inference latency across ${popular.length} popular models.`,
      // averageResponseLatency, not runLength: the run_length column is the
      // literal value 1 for every AI model in every bucket, so charting it
      // gives one flat line per model at y=1.
      spec: jobGroupSpec(
        "ai",
        "averageResponseLatency",
        popular.map((j) => j.internalJobName),
        "Popular Workers AI models"
      ),
    });
  }

  // --- Regions --------------------------------------------------------------
  // One representative job rather than one preset per job; the picker covers
  // the rest.
  // Ordered by how much the job actually varies between regions: `worker` spans
  // 2.05x with each series moving 87-134%, `waf` spans 1.26x, and `dns` is
  // 1.02x with 0.1% movement — seven identical flat lines. The old order tried
  // dns first, which produced the least informative chart on the page.
  const regionJob = ["worker", "waf", "dns"].find((n) => delayNames.has(n));
  if (regionJob) {
    const spec = regionSpec(regionJob, ctx.locationsByRegion);
    if (spec) {
      // Region sizes are wildly uneven — some carry a couple of dozen probes and
      // some carry one. A single-probe "regional median" is not wrong, but the
      // word region invites more confidence than one location earns, so the
      // counts travel with the preset.
      const sizes = REGION_ORDER.filter((r) => (ctx.locationsByRegion.get(r)?.length ?? 0) > 0)
        .map((r) => `${r} ${ctx.locationsByRegion.get(r)!.length}`)
        .join(", ");
      presets.push({
        id: `region-${regionJob}`,
        topic: "propagation", breakdown: "Regions",
        group: "Regions",
        label: `${sourceLabel("workersDelay", regionJob)} by region`,
        description: `The same job as seen from each region's edge locations (${sizes}).`,
        spec,
      });
    }
  }

  return presets;
}

/**
 * Group locations the way the backend does: by friendlyRegionName.
 *
 * `region` on the same record is the Cloudflare load-balancer code (weur, enam,
 * apac) and is *not* the NA/EU/AS grouping this site shows — using it would
 * silently produce empty series. CacheSingletonService groups on
 * FriendlyRegionName, with no filter on `enabled`, and matching that is what
 * lets these series be checked against the existing region charts.
 */
export function groupLocationsByRegion(
  locations: { locationName: string; friendlyRegionName?: string }[]
): Map<string, string[]> {
  const byRegion = new Map<string, string[]>();
  for (const loc of locations) {
    const region = (loc.friendlyRegionName ?? "").toUpperCase();
    if (!region || !loc.locationName) continue;
    const list = byRegion.get(region) ?? [];
    list.push(loc.locationName);
    byRegion.set(region, list);
  }
  return byRegion;
}

/**
 * Curated sets as presets, dropping any whose sources are no longer present.
 *
 * `availableByFamily` maps a family to the dimension values actually seen in the
 * data. Pass an empty map to skip the check — the sets still render, but a
 * renamed source will produce an empty chart instead of disappearing.
 */
export function buildCuratedPresets(
  availableByFamily: Map<string, Set<string>>,
  now = Date.now()
): Preset[] {
  const out: Preset[] = [];
  for (const set of CURATED) {
    const spec = curatedSpec(set, availableByFamily.get(set.family) ?? (set.family === "perfLocations" ? availableByFamily.get("perf") : undefined) ?? null, 0, now);
    if (!spec) continue;
    out.push({
      id: set.id,
      topic: set.topic ?? (set.family === "yabs" ? "ci" : "websockets"),
      breakdown: set.breakdown ?? set.label,
      service: set.service,
      group: set.group,
      label: set.label,
      description: set.description,
      spec,
      curatedId: set.id,
    });
  }
  return out;
}

/** The curated metadata the explorer needs to render a metric switch. */
export function curatedMetrics(): { id: string; metrics: CuratedSet["metrics"] }[] {
  return CURATED.filter((c) => c.metrics.length > 1).map((c) => ({ id: c.id, metrics: c.metrics }));
}
