import { experiment, experimentLabel, sharedProbes } from './experiments';
import type { CompareSpec } from './spec';
export interface ExperimentComparison {
  id: string; topic: string; label: string; description: string; breakdown: string;
  sources: string[]; descriptive?: boolean; regional?: boolean;
}
const sets: ExperimentComparison[] = [];
function add(id: string, topic: string, label: string, description: string, sources: string[], breakdown = 'Experiments', extra: Partial<ExperimentComparison> = {}) {
  sets.push({id,topic,label,description,sources,breakdown,...extra});
}
add('featured-static-delivery','assets','Static file delivery','How do static assets and global KV/R2 reads compare? Cache behavior and delivery paths differ; this is a descriptive comparison.',[
  'cloudflare-pages-uncached-10kb','cloudflare-workerassets-uncached-10kb','bunny-ssdstorage-cached-10kb','bunny-highvolume-ssdstorage-cached-10kb',
  'fly-tigris-uncached-10kb','cloudflare-kv-cached-10kb','cloudflare-kv-uncached-10kb','cloudflare-r2-uncached-10kb',
],'Delivery paths',{descriptive:true});
add('featured-hosted-applications','applications','Hosted applications','How do code responses compare from nine shared US probes? Response bodies, runtimes and hosting placements differ; these are not equivalent-workload rankings.',[
  'aws-lambda-uncached-hello-world','googlecloud-run-uncached-hello-world','azure-containerapp-uncached-hello-world',
  'cloudflare-containers-uncached-hello-world','cloudflare-worker-uncached-10kb','cloudflare-python-worker-uncached-hello-world',
],'Providers',{descriptive:true});
add('perf-variant-compute-functions-uncached-10kb','compute','Edge code response','How quickly does edge code return a nominal 10 kB response? Includes the HTTP request path; this is not a CPU benchmark.',[
  'cloudflare-worker-uncached-10kb','bunny-scripts-uncached-10kb','fastly-compute-uncached-10kb',
],'Providers');
add('perf-us-applications','applications','Prewarmed applications from US probes','How quickly does an ASP.NET Core hello-world application respond from the same nine US probes? Hosting placement differs.',[
  'cloudflare-containers-uncached-hello-world','googlecloud-run-uncached-hello-world','aws-lambda-uncached-hello-world','azure-containerapp-uncached-hello-world',
],'Providers');
add('perf-static-delivery','assets','Static file delivery','Compare configured delivery paths for static files. Cache behavior and hosting architecture differ; values are descriptive.',[
  'cloudflare-pages-uncached-10kb','cloudflare-workerassets-uncached-10kb','cloudflare-workerassets-binding-uncached-10kb','bunny-ssdstorage-cached-10kb','bunny-highvolume-ssdstorage-cached-10kb','fly-tigris-uncached-10kb',
],'Delivery paths',{descriptive:true});
add('cache-workers-native','caching','Workers: native response caching','Native response cache enabled versus no-store on the same script. Cache-enabled requests are not guaranteed hits; local payload is 10,240 bytes.',[
  'cloudflare-worker-cached-10kb','cloudflare-worker-uncached-behind-cdn-10kb',
],'Native response cache');
add('cache-bunny','caching','Bunny: CDN caching','Configured CDN caching versus cache bypass on the Standard network. Configuration does not establish the cache status of every response.',[
  'bunny-ssdstorage-cached-10kb','bunny-ssdstorage-uncached-10kb',
],'CDN caching');
for (const op of ['upload','download']) {
  for (const region of ['enam','wnam']) add(`perf-variant-object-storage-${op}-${region}-10kb`,'storage',`S3 ${op} · ${region.toUpperCase()}`,
    `10,000-byte ${op}s using the S3 API. Filtered to common configured probe locations; backend placements differ.`,
    region === 'enam' ? [`cloudflare-r2-enam-${op}-10kb`,`aws-storage-enam-${op}-10kb`,`googlecloud-storage-enam-${op}-10kb`,`xenyth-os-iad-${op}-10kb`] : [`cloudflare-r2-wnam-${op}-10kb`,`backblaze-b2-wnam-${op}-10kb`], 'Providers');
  add(`perf-region-r2-${op}`,'storage',`R2 S3 ${op} by configured region`,'Each configured bucket is tested from its own regional probe cohort. Differences combine probe geography and backend placement.',
    ['enam','wnam','weur','eeur','apac','oc'].map(r=>`cloudflare-r2-${r}-${op}-10kb`),'Regions',{regional:true,descriptive:true});
  add(`perf-payload-r2-${op}`,'storage',`R2 S3 ${op} by payload size`,'100 B, 10,000 B and 1,000,000 B objects from the same western European probes. Payload sizes differ; values are descriptive.',
    ['100b','10kb','1mb'].map(s=>`cloudflare-r2-weur-${op}-${s}`),'Payload sizes',{descriptive:true});
}
for (const region of ['enam','eeur']) add(`r2-access-${region}`,'storage',`R2 upload access method · ${region.toUpperCase()}`,'10,000-byte uploads via S3 and Worker binding from common configured probes. Includes their different request paths.',
  [`cloudflare-r2-${region}-upload-10kb`,`cloudflare-r2-${region}-upload-worker-10kb`],'Access method');
add('bunny-upload-access','storage','Bunny upload access method','HTTP storage API versus S3 uploads to the Frankfurt primary from FRA, MXP, VIE and LHR.',[
  'bunny-ssdstorage-upload-10kb','bunny-ssdstorage-s3upload-10kb',
],'Access method');
add('perf-payload-kv-read','kv','KV reads by payload size','100 B, 10,000 B and 1,000,000 B values with a 60-second cache TTL. Short TTL does not guarantee a cache miss.',
  ['100b','10kb','1mb'].map(s=>`cloudflare-kv-uncached-${s}`),'Payload sizes',{descriptive:true});
add('perf-do-storage','kv','Durable Object storage writes','SQLite-backed versus KV-backed storage writes, including transactions, storage sync, and the Worker-to-object path. Uses their common 15 probes.',[
  'cloudflare-durableobjects-sqlite-upload-10kb','cloudflare-durableobjects-kv-upload-10kb',
],'Storage backends');
add('perf-region-d1','sql','D1 queries by configured region','Each database uses its own regional probe cohort. Backend geography and probe geography change together.',
  ['enam','wnam','weur','eeur','apac','oc'].map(r=>`cloudflare-d1-${r}-worker`),'Regions',{regional:true,descriptive:true});
add('perf-d1-replicas','sql','D1 replica query preparation','Compare database prewarming with connection-only prewarming, restricted to the same six probes. This does not guarantee cold database requests.',[
  'cloudflare-d1-read-replicas','cloudflare-d1-read-replicas-coldstart',
],'Query preparation',{descriptive:true});
for (const [suffix,title] of [['worker','Reads'],['worker-storageselect','Expensive queries'],['upload-worker-10kb','Writes']]) add(`perf-database-${suffix}`,'sql',`D1 and Turso · ${title}`,
  'Eastern US database experiments from common probes. Query/result and warmup equivalence are unverified; no automatic ranking.',[
    `cloudflare-d1-enam-${suffix}`,`turso-db-enam-${suffix}`,
  ],title,{descriptive:true});
export const EXPERIMENT_COMPARISONS = sets;
export function experimentSpec(c: ExperimentComparison, available: Set<string> | null, now = Date.now()): CompareSpec | null {
  const ids = c.sources.filter(id=>experiment(id) && (!available || available.has(id)));
  if (ids.length < 2) return null;
  const probes = sharedProbes(ids);
  if (!c.regional && probes?.length === 0) return null;
  return {title:c.label,from:new Date(now-7*86400000).toISOString(),to:new Date(now).toISOString(),series: c.regional
    ? ids.map(id=>({family:'perfLocations',metric:'responseLatency',op:'median',label:experimentLabel(experiment(id)!),filters:{jobName:[id],locationName:experiment(id)!.probes!.map(p=>p.toUpperCase())}}))
    : [{family:'perfLocations',metric:'responseLatency',op:'median',groupBy:'jobName',filters:{jobName:ids,...(probes ? {locationName:probes.map(p=>p.toUpperCase())} : {})}}],
  };
}
