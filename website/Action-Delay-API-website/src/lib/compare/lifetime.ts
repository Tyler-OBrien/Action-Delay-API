import type { CompareSpec } from './spec';
import type { CompareResult, CompareSeries } from './gql';
import { runCompare } from './gql';
import { sourceLabel } from './labels';
import { measurement } from './measurement';

export interface LifetimeSummary {
  sourceId: string;
  label: string;
  medianDuration: number | null;
  p10Duration: number | null;
  p90Duration: number | null;
  atLeast1HourCount: number | null;
  atLeast6HoursCount: number | null;
  atLeast24HoursCount: number | null;
  count: number;
  lastReportedAt: string | null;
}
export function isLifetime(spec: CompareSpec | null): boolean {
  return !!spec && spec.series.length === 1 && spec.series[0].family === 'websocketMonitoring' &&
    spec.series[0].metric === 'duration' && spec.series[0].op === 'median' && spec.series[0].groupBy === 'source';
}
async function query(endpoint: string, query: string, variables: object, fetchImpl: typeof fetch) {
  const response = await fetchImpl(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) });
  const body = await response.json();
  if (!response.ok || body.errors || !body.data) throw new Error('Lifetime query unavailable');
  return body.data;
}
export async function runLifetime(spec: CompareSpec, endpoint: string, fetchImpl: typeof fetch = fetch) {
  const s = spec.series[0];
  const variables = { from: spec.from, to: spec.to, source: s.filters?.source, closecode: s.filters?.closecode };
  const args = '($from: Time!, $to: Time!, $source: [String!], $closecode: [String!])';
  const filters = 'from: $from, to: $to, source: $source, closecode: $closecode';
  let lifetimeThresholdsUnavailable = false;
  const summaryQuery = (extended: boolean) => query(endpoint, `query LifetimeSummary${extended ? 'Extended' : ''}${args} { summary: websocketMonitoringSummary(${filters}) { source medianDuration count lastReportedAt ${extended ? 'p10Duration p90Duration atLeast1HourCount atLeast6HoursCount atLeast24HoursCount' : ''} } }`, variables, fetchImpl);
  const [daily, summary] = await Promise.allSettled([
    query(endpoint, `query LifetimeDaily${args} { daily: websocketMonitoring(${filters}, daily: true) { tier intervalMinutes points { time source medianDuration count } } }`, variables, fetchImpl),
    summaryQuery(true).catch(() => { lifetimeThresholdsUnavailable = true; return summaryQuery(false); }),
  ]);
  let compare: CompareResult;
  if (daily.status === 'fulfilled') {
    const raw = daily.value.daily;
    const sources = [...new Set<string>([...(s.filters?.source ?? []), ...raw.points.map((p: any) => p.source)])].sort();
    const series: CompareSeries[] = sources.map(sourceId => ({
      key: `s0:${sourceId}`, sourceId, label: sourceLabel(s.family, sourceId), unit: 'ms', direction: 'higher',
      ...measurement(s.family, s.metric, s.op, sourceId), intervalMinutes: 1440, tier: raw.tier,
      points: raw.points.filter((p: any) => p.source === sourceId && typeof p.medianDuration === 'number' && Number.isFinite(p.medianDuration))
        .map((p: any) => ({ x: Date.parse(p.time), y: p.medianDuration, reports: Number(p.count) }))
        .sort((a: any, b: any) => a.x - b.x),
    }));
    compare = { series, intervalMinutes: 1440, tiers: [raw.tier], warnings: [] };
  } else {
    compare = await runCompare(spec, endpoint, fetchImpl);
    compare.warnings.push('Daily lifetime reports are unavailable. Showing the available reporting periods.');
  }
  let lifetimeSummary: LifetimeSummary[] | null = null;
  if (summary.status === 'fulfilled') {
    const rows = summary.value.summary;
    const sources = [...new Set<string>([...compare.series.map(s => s.sourceId), ...rows.map((r: any) => r.source)])].sort();
    lifetimeSummary = sources.map(sourceId => {
      const row = rows.find((r: any) => r.source === sourceId);
      return { p10Duration: row?.p10Duration ?? null, p90Duration: row?.p90Duration ?? null,
        atLeast1HourCount: row?.atLeast1HourCount ?? null, atLeast6HoursCount: row?.atLeast6HoursCount ?? null, atLeast24HoursCount: row?.atLeast24HoursCount ?? null,
        sourceId, label: sourceLabel(s.family, sourceId), medianDuration: row?.medianDuration ?? null, count: Number(row?.count ?? 0), lastReportedAt: row?.lastReportedAt ?? null };
    });
  }
  return { ...compare, lifetimeThresholdsUnavailable, lifetimeSummary, lifetimeSummaryUnavailable: summary.status === 'rejected' };
}

// Counts come from raw reports, never from the plotted daily medians.
export function lifetimePercentage(count: number | null, total: number): number | null {
  return count !== null && Number.isFinite(count) && Number.isFinite(total) && total > 0 && count >= 0 && count <= total ? count / total * 100 : null;
}
export function formatLifetimeDuration(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return '—';
  if (ms < 60000) return ms < 1000 && ms > 0 ? `${Math.round(ms)} ms` : `${Number((ms / 1000).toFixed(1))} s`;
  const minutes = Math.round(ms / 60000);
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours} h${minutes % 60 ? ` ${minutes % 60} min` : ''}` : `${minutes} min`;
}
