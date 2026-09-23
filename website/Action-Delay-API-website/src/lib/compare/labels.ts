import { PROPAGATION_JOBS } from './propagation';
import { experiment, experimentLabel } from './experiments';
import { DELAY_CATEGORIES } from '../../data/jobCategories';

const humanize = (id: string) => id.replace(/[-_/]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
export function delayLabel(id: string) {
  if (id === "dns") return "Cloudflare · DNS propagation · Paid";
  if (id === "dnsfree") return "Cloudflare · DNS propagation · Free";
  if (id === "cron") return "Workers Cron · once-per-minute schedule";
  if (PROPAGATION_JOBS[id]) return PROPAGATION_JOBS[id].label;
  return DELAY_CATEGORIES.flatMap(c => c.items).find(j => j.jobName === id)?.name ?? humanize(id);
}
export function performanceLabel(id: string) {
  const e = experiment(id);
  if (e) return experimentLabel(e);
  return humanize(id);
}
export const aiLabel = (id: string) => id.replace(/^@/, '').split('/').map(humanize).join(' · ');
const sources: Record<string, string> = {
  pages: 'Cloudflare · Pages', workersbuilds: 'Cloudflare · Workers Builds · Paid',
  workersbuildsfree: 'Cloudflare · Workers Builds · Free', githubactions: 'GitHub · Actions',
  blacksmith: 'Blacksmith', cfcontainers: 'Cloudflare · Containers',
};
export const yabsLabel = (id: string) => sources[id] ?? humanize(id);
const regions: Record<string, string> = { eeur: 'Eastern Europe', weur: 'Western Europe', enam: 'Eastern North America', wnam: 'Western North America', apac: 'Asia-Pacific', oc: 'Oceania' };
const websocketSources: Record<string, string> = {
  'AWS-CloudFront': 'AWS · CloudFront',
  'Google-LB': 'Google · Load Balancer',
};
export const websocketLabel = (id: string) => websocketSources[id] ?? [id.split('-').map(t => regions[t] ?? ({ DurableObjects: 'Durable Objects', Websocket: 'WebSocket' }[t] ?? humanize(t))).join(' · '), id.startsWith('Cloudflare') && !/(^|-)free($|-)/i.test(id) ? 'Paid' : ''].filter(Boolean).join(' · ');
export function sourceLabel(family: string, id: string): string {
  if (family === 'yabs') return yabsLabel(id);
  if (family === 'websocketMonitoring') return websocketLabel(id);
  if (/perf/i.test(family)) return performanceLabel(id);
  if (/ai/i.test(family)) return aiLabel(id);
  return delayLabel(id);
}
