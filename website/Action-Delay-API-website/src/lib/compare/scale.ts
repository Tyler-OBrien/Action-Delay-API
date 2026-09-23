// Axis and value formatting decisions for the comparison chart.
//
// Separate from CompareGraph.jsx so it can be tested without pulling in Plotly:
// the log-scale rule has a failure mode that is silent on screen (points vanish
// rather than erroring), so it needs a test that can actually run.

export interface PlottedSeries {
  unit?: string;
  points: { x: number; y: number }[];
}

/**
 * Ratio between the largest and smallest series median.
 *
 * Medians rather than raw extremes, so a single outlier bucket cannot flip the
 * whole axis into log mode.
 */
export function seriesSpread(series: PlottedSeries[]): number {
  const medians: number[] = [];
  for (const s of series) {
    const ys = s.points.map((p) => p.y).filter((y) => Number.isFinite(y)).sort((a, b) => a - b);
    if (!ys.length) continue;
    const mid = ys.length >> 1;
    medians.push(ys.length % 2 ? ys[mid] : (ys[mid - 1] + ys[mid]) / 2);
  }
  if (medians.length < 2) return 1;
  const lo = Math.min(...medians);
  const hi = Math.max(...medians);
  return lo > 0 ? hi / lo : Infinity;
}

export const LOG_SPREAD_THRESHOLD = 20;

/**
 * Should the y-axis be logarithmic?
 *
 * Some comparisons are legitimately orders of magnitude apart: Workers delay
 * spans 119x because a cron is pinned at 60s while a WfP deploy is half a
 * second, and SSL spans 176x because certificate renewal takes 20 minutes. On a
 * linear axis the big series pins the top and the rest are a flat line on the
 * floor.
 *
 * Never with a non-positive value present. Plotly drops those points silently on
 * a log axis, and they are real data: error counts are legitimately zero in
 * quiet buckets, and some datasets contain legitimate zero measurements.
 */
export function useLogScale(series: PlottedSeries[]): boolean {
  const all = series.flatMap((s) => s.points.map((p) => p.y)).filter((y) => Number.isFinite(y));
  if (all.length === 0) return false;
  if (all.some((y) => y <= 0)) return false;
  return seriesSpread(series) > LOG_SPREAD_THRESHOLD;
}

export function formatMs(ms: number): string {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return String(ms);
  if (ms < 1000) return ms.toFixed(0) + " ms";
  const seconds = ms / 1000;
  if (seconds < 60) return seconds.toFixed(2) + " s";
  const minutes = seconds / 60;
  if (minutes < 60) return minutes.toFixed(2) + " min";
  return (minutes / 60).toFixed(2) + " h";
}

/**
 * yabs reports sizes and throughput in kilobytes — the columns are bare UInt32
 * with no unit, and the magnitudes settle it (a `ram` of 12514296 is 11.9 GiB,
 * not 11.9 TiB). Printed raw they are unreadable seven-digit numbers.
 */
export function formatKb(kb: number, perSecond: boolean): string {
  const suffix = perSecond ? "/s" : "";
  if (!Number.isFinite(kb)) return String(kb);
  if (kb >= 1024 * 1024) return `${(kb / 1024 / 1024).toFixed(1)} GiB${suffix}`;
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MiB${suffix}`;
  return `${kb.toFixed(0)} KiB${suffix}`;
}

const UNIT_SUFFIX: Record<string, string> = { count: "", iops: " IOPS", mhz: " MHz", score: "" };

export function formatValue(value: number | null, unit?: string): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (unit === "ms") return formatMs(value);
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value);
  if (unit === "kb") return formatKb(value, false);
  if (unit === "iops") return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} IOPS`;
  if (unit === "kbps") return formatKb(value, true);
  const rounded = Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2);
  return `${rounded}${UNIT_SUFFIX[unit ?? ""] ?? ""}`;
}

export function rawValue(value: number | null, unit?: string): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  const suffix: Record<string, string> = { iops: "IOPS", ms: "ms", kb: "KB", kbps: "KB/s", mhz: "MHz", count: "count", score: "score" };
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 12 })} ${suffix[unit ?? ""] ?? ""}`.trim();
}
