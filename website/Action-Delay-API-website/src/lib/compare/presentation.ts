import { benchmarkCadence, type BenchmarkSource } from './benchmarks';
import type { Experiment } from './experiments';
export interface DisplaySource { label: string; sourceId: string; experiment?: Experiment; benchmark?: BenchmarkSource; observationScope?: string }
export interface Detail { key: string; label: string; value: string; locations?: string[] }
const normalized = (values: string[]) => [...new Set(values.map(v=>v.trim().toUpperCase()).filter(Boolean))].sort();
const known = (value: unknown): value is string | number => value !== undefined && value !== null && String(value).trim() !== '' && !/not established|not specified|unverified|unknown/i.test(String(value));
function coverage(s: DisplaySource) {
  const configured = s.experiment?.probes ? normalized(s.experiment.probes) : null;
  const scope = s.observationScope?.split(':').slice(1).join(':');
  const selected = scope && scope !== 'all-enabled' ? normalized(scope.split(',')) : configured;
  const narrowed = !!selected && (!configured || selected.some(p=>!configured.includes(p)) === false && selected.length < configured.length);
  return {configured, selected, narrowed};
}
/** Presentation only: never changes source IDs, chart colors, queries or ranking. */
export function compactLabels(sources: DisplaySource[]): string[] {
  const bases = sources.map(s=>s.experiment ? `${s.experiment.provider} · ${s.experiment.service}` : s.label);
  return sources.map((s,i)=>{
    const peers = sources.filter((_,j)=>bases[j] === bases[i]);
    if (peers.length === 1) return bases[i];
    if (!s.experiment) return `${bases[i]} · ${s.sourceId} · ${i+1}`;
    const fields: (keyof Experiment)[] = ['variant','cache','operation','payloadBytes','plan','access','connection','warmup'];
    const differing = fields.filter(key=>new Set(peers.map(p=>p.experiment?.[key])).size > 1);
    const qualifiers: string[]=[];
    const used: (keyof Experiment)[]=[];
    const valueOf=(p: DisplaySource,key: keyof Experiment)=>{
      const value=p.experiment?.[key];
      return known(value) ? key === 'payloadBytes' ? `${Number(value).toLocaleString('en-US')} B` : String(value) : '';
    };
    for (const key of differing) {
      used.push(key);
      const value=valueOf(s,key); if(value) qualifiers.push(value);
      if(peers.filter(p=>used.every(k=>valueOf(p,k)===valueOf(s,k))).length===1) break;
    }
    const label=[bases[i],...qualifiers].join(' · ');
    return peers.filter(p=>used.every(k=>valueOf(p,k)===valueOf(s,k))).length===1
      ? label : `${label} · ${s.sourceId} · ${i+1}`;
  });
}
export function comparisonPresentation(sources: DisplaySource[]) {
  const perSource = sources.map(s=>{
    if(s.benchmark) {
      const b=s.benchmark;
      const details:Detail[]=[{key:'configuration',label:'Configured environment',value:b.configuration},{key:'cadence',label:'Scheduled cadence',value:benchmarkCadence(b.cadenceMinutes)}];
      if(b.capacity) details.push({key:'capacity',label:'Configured capacity',value:b.capacity});
      return {details,narrowed:false,configured:null,note:b.observation??''};
    }
    const e=s.experiment;
    if (!e) return {details:[] as Detail[], narrowed:false, configured:null, note:'Experiment metadata unavailable.'};
    const {configured,selected,narrowed}=coverage(s);
    const details: Detail[]=[];
    const add=(key: string,label: string,value: unknown)=>{if(known(value)) details.push({key,label,value:String(value)});};
    add('operation','Operation',e.operation);
    add('payload','Payload',e.payloadBytes != null ? `${e.payloadBytes.toLocaleString('en-US')} bytes` : e.payloadNote);
    add('access','Access',e.access);
    details.push({key:'probes',label:'Probe locations',value:selected ? `${selected.length} locations` : 'All enabled locations',...(selected ? {locations:selected} : {})});
    add('backend','Backend',e.backend); add('cache','Cache',e.cache); add('warmup','Preparation',e.warmup);
    add('connection','Connection',e.connection); add('network','Network',e.network);
    add('requests','Requests per probe per run',e.requestsPerProbe); add('plan','Zone plan',e.plan);
    // Retain uncertainty that affects interpretation without empty placeholder rows.
    const uncertain=[e.backend,e.cache,e.payloadNote].filter(v=>v && !known(v) && !/^(Placement not established|Not established|Unverified)$/i.test(v));
    return {details,narrowed,configured,note:[...uncertain,e.note].filter(Boolean).join(' ')};
  });
  const shared = (perSource[0]?.details ?? []).filter(d=>perSource.every(s=>s.details.some(other=>other.key===d.key && other.value===d.value && JSON.stringify(other.locations)===JSON.stringify(d.locations))));
  const sharedKeys=new Set(shared.map(d=>d.key));
  const labels=compactLabels(sources);
  return {shared, sources:perSource.map((s,i)=>({...s,label:labels[i],details:s.details.filter(d=>!sharedKeys.has(d.key))}))};
}

/** Counts plotted time points, never individual benchmark runs. */
export const limitedBenchmarkHistory = (s: { comparisonKey: string; buckets: number }) => s.comparisonKey.startsWith('yabs:') && s.buckets > 0 && s.buckets < 5;

/** Match the chart's source order before an independent panel's main request finishes. */
export function pendingSourceIndex(spec: import('./spec').CompareSpec, sourceId:string, fallback=0):number {
  const ids=spec.series.flatMap(s=>s.groupBy
    ? [...(s.filters?.[s.groupBy]??[])].sort((a,b)=>s.family==='websocketMonitoring'?(a<b?-1:a>b?1:0):a.localeCompare(b))
    : [(s.filters?.jobName??s.filters?.source??[]).join(', ')]);
  const index=ids.indexOf(sourceId);
  return index<0?fallback:index;
}
