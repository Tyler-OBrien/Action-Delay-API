import { PROPAGATION_COMPARISONS } from './propagation';
import type { Preset } from './presets';
import type { Op } from './catalog';
import { sourceLabel } from './labels';
import { serializeView } from './urlState';
export const DISCOVERY_GROUPS = ['Storage & databases','Runtime & delivery','Build environments','Propagation','WebSockets','Workers AI'];
const groupFor = (topic:string) => ({storage:DISCOVERY_GROUPS[0],kv:DISCOVERY_GROUPS[0],sql:DISCOVERY_GROUPS[0],compute:DISCOVERY_GROUPS[1],applications:DISCOVERY_GROUPS[1],assets:DISCOVERY_GROUPS[1],caching:DISCOVERY_GROUPS[1],ci:DISCOVERY_GROUPS[2],propagation:DISCOVERY_GROUPS[3],websockets:DISCOVERY_GROUPS[4],ai:DISCOVERY_GROUPS[5]}[topic] ?? DISCOVERY_GROUPS[1]);
export type MetricChoices = {id:string;metrics:{metric:string;op:Op;label?:string}[]}[];
export interface DiscoveryEntry {key:string; preset:Preset; group:string; title:string; description:string; metric:string; curated:boolean; sources:string[]; searchText:string}
export const DISCOVERY_STARTS = [
  {id:'propagation-google-cloudflare',title:'Google vs Cloudflare propagation',description:'Compare DNS updates, blocking rules and redirect changes across both providers.'},
  {id:'perf-region-r2-upload',title:'R2 uploads across regions',description:'Compare configured buckets, each tested from its regional probe locations.'},
  {id:'r2-access-enam',title:'R2: S3 versus Worker binding',description:'Upload the same payload through two access paths from eastern North American probes.'},
  {id:'perf-d1-replicas',title:'D1 replica preparation',description:'Compare database prewarming with connection-only prewarming.'},
  {id:'perf-do-storage',title:'Durable Object storage writes',description:'Compare SQLite-backed and KV-backed writes from the same probe locations.'},
  {id:'perf-variant-compute-functions-uncached-10kb',title:'Edge-code responses',description:'Small code-generated responses from Workers, Edge Scripting and Compute.'},
  {id:'cache-workers-native',title:'Native Workers caching',description:'Compare cache-enabled and no-store responses on the same script.'},
  {id:'perf-us-applications',title:'Prewarmed US applications',description:'ASP.NET Core hello-world responses from four hosting platforms.'},
  {id:'yabs-ci-runners',metric:'geekbenchsingle',title:'CI single-core scores',description:'Compare Geekbench 6 single-core scores.'},
  {id:'yabs-ci-runners',metric:'geekbenchmulti',title:'CI multi-core scores',description:'Compare Geekbench 6 multi-core scores, including Blacksmith.'},
  {id:'yabs-ci-runners',metric:'speedrw',title:'CI disk throughput',description:'Compare 4 KiB random mixed read/write throughput across build environments.'},
  {id:'delay-dns',title:'DNS Free versus Paid',description:'Compare DNS update propagation across the available plan variants.'},
  {id:'region-worker',title:'Worker deployment by region',description:'See where probes observe a Worker deployment becoming available.'},
];
export const discoveryKey=(id:string,metric:string)=>`${id}:${metric}`;
export function resolveDiscovery(presets:Preset[],choices:MetricChoices):DiscoveryEntry[] {
  const entries=new Map<string,DiscoveryEntry>();
  const add=(p:Preset,metric:string,title:string,description:string,curated:boolean)=>{
    const choice=choices.find(c=>c.id===p.id)?.metrics.find(m=>m.metric===metric);
    if(metric!==p.spec.series[0]?.metric && !choice) return;
    const spec=choice ? {...p.spec,series:p.spec.series.map(s=>({...s,metric:choice.metric,op:choice.op}))} : p.spec;
    const key=discoveryKey(p.id,metric);
    if(entries.has(key)) return;
    const sources=[...new Set(spec.series.flatMap(s=>s.filters?.jobName??s.filters?.source??[]))];
    const names=spec.series.flatMap(s=>(s.filters?.jobName??s.filters?.source??[]).map(id=>sourceLabel(s.family,id)));
    const group=groupFor(p.topic);
    entries.set(key,{key,preset:{...p,spec},group,title,description,metric,curated,sources,searchText:[title,description,p.label,p.description,p.topic,p.breakdown,group,...sources,...names].join(' ').toLowerCase()});
  };
  for(const start of DISCOVERY_STARTS) {
    const p=presets.find(p=>p.id===start.id);if(p) add(p,start.metric??p.spec.series[0].metric,start.title,start.description,true);
  }
  for(const p of presets) add(p,p.spec.series[0].metric,p.id==='perf-static-delivery'?'Additional static delivery paths':p.label,p.description,false);
  return [...entries.values()];
}
export function relatedDiscovery(entries:DiscoveryEntry[],preset?:Preset,metric?:string):DiscoveryEntry[] {
  const key=preset ? discoveryKey(preset.id,metric??preset.spec.series[0].metric) : null;
  const sources=new Set(preset?.spec.series.flatMap(s=>s.filters?.jobName??s.filters?.source??[])??[]);
  const group=preset ? groupFor(preset.topic) : null;
  const propagationIds = new Set(PROPAGATION_COMPARISONS.map(c=>c.id));
  const relatedPropagation = (e:DiscoveryEntry) => !!preset && propagationIds.has(preset.id) && propagationIds.has(e.preset.id);
  return entries.map((e,index)=>({e,index,overlap:e.sources.filter(s=>sources.has(s)).length})).filter(({e})=>e.key!==key)
    .sort((a,b)=>Number(relatedPropagation(b.e))-Number(relatedPropagation(a.e))||Number(b.e.group===group)-Number(a.e.group===group)||b.overlap-a.overlap||Number(b.e.curated)-Number(a.e.curated)||a.index-b.index)
    .slice(0,3).map(({e})=>e);
}
export function searchDiscovery(entries:DiscoveryEntry[],query:string) {
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return entries.filter(e=>words.every(word=>e.searchText.includes(word)));
}
export function discoveryHref(entry:DiscoveryEntry,presets:Preset[],choices:MetricChoices) {
  const spec=entry.preset.spec;
  const params=serializeView({spec,presetId:entry.preset.id,title:entry.preset.label,hours:(Date.parse(spec.to)-Date.parse(spec.from))/3600000,history:false},presets,choices);
  return `/perf/${params.size?'?'+params:''}`;
}
