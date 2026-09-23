import { PROPAGATION_JOBS } from './propagation';
import { benchmarkSource, benchmarkCadence, benchmarkMetricNote } from './benchmarks';
import { cachingSource } from "./caching";
import { experiment, experimentDetails } from './experiments';
import { EXPERIMENT_COMPARISONS } from './experimentComparisons';

export const LIFETIME_CONTEXT = 'Based on connections reported during this period; ongoing connections aren’t included.';
const DELAY_PURPOSE: Record<string, string> = {
  worker: 'deployment', wfp: 'deployment', dns: 'dns-update', dnsfree: 'dns-update',
  cron: 'scheduled-execution', workerlogs: 'log-delivery', waf: 'custom-rule-update',
  pagerule: 'page-rule-update', cert: 'certificate-renewal', customhostnames: 'hostname-setup',
  analytics: 'analytics', workeranalytics: 'worker-analytics', logpush: 'log-delivery',
};
export function measurement(family: string, metric: string, op: string, sourceId: string, locations?: string[]) {
  const e = /^(perf|perfLocations)$/.test(family) ? experiment(sourceId) : undefined;
  const observationScope = e ? `${family}:${[...(locations ?? e.probes ?? ["all-enabled"])].map(p=>p.toLowerCase()).sort().join(",")}` : undefined;
  const benchmark=family==='yabs' ? benchmarkSource(sourceId) : undefined;
  const metricContext=family==='yabs' ? benchmarkMetricNote(metric) : undefined;
  let purpose = sourceId, ranking = true;
  let context = 'Each chart point summarizes readings over time. The typical value summarizes those chart points.';
  if (family === 'websocketMonitoring') {
    purpose = metric;
    if (metric === 'duration') { ranking = false; context = LIFETIME_CONTEXT; }
  } else if (family === 'yabs') {
    purpose = 'hardware-benchmark';
    context = [metricContext,benchmark?.configuration,benchmark ? `Configured schedule: ${benchmarkCadence(benchmark.cadenceMinutes)}; actual reporting frequency varies.` : '',benchmark?.capacity].filter(Boolean).join(' ');
  } else if (family === 'perf' || family === 'perfLocations') {
    purpose = `${e?.match ?? sourceId}:${observationScope}`;
    ranking = Boolean(e && (e.match || cachingSource(sourceId) || EXPERIMENT_COMPARISONS.some(c=>!c.descriptive && c.sources.includes(sourceId))));
    context = 'Response-time summaries use successful probe measurements. Typical values summarize plotted time points, not individual requests. Top-level performance data contains per-run medians.';
    if (!e) context += ' Experiment metadata is unavailable; this source is descriptive only.';
    else context += ` ${experimentDetails(e)}`;

  } else if (family === 'workersDelay' || family === 'workersDelayLocations') {
    purpose = PROPAGATION_JOBS[sourceId]?.purpose ?? DELAY_PURPOSE[sourceId] ?? sourceId;
    if (PROPAGATION_JOBS[sourceId]) context += ' ' + PROPAGATION_JOBS[sourceId].context;
    if (sourceId === 'cron') {
      ranking = false;
      context = 'This probe uses a once-per-minute cron schedule. Job time includes the scheduling cadence; it is not a measurement of scheduler lateness.';
    }
  } else {
    ranking = false;
    context = 'These workloads serve different purposes; values are descriptive rather than a performance ranking.';
  }
  return { comparisonKey: `${family.replace(/Locations$/, '')}:${metric}:${op}:${purpose}`, rankingEligible: ranking, measurementContext: context, experiment: e, observationScope, benchmark, metricContext };
}
