/** Public experiment metadata, audited against the supplied PerfConfig and local
 * collectors/scripts. Never copy endpoints, headers or credentials here.
 * Configured placement is not a measurement of actual backend location. */
export interface Experiment {
  id: string; provider: string; service: string; topic: string; operation: string;
  variant?: string; payloadBytes?: number; payloadNote?: string; access: string; cache: string;
  probes: string[] | null; backend: string; warmup: string; connection: string;
  requestsPerProbe: number; network: string; plan?: string; routing?: boolean; note?: string;
  /** Explicitly audited workload match; absent means descriptive only. */
  match?: string;
}
export const PROBES: Record<string, string[]> = {
  enam: ['atl','mia','ewr','dtw','ord','iad'], wnam: ['sjc','sea','dfw','slc','las','pdx'],
  weur: ['cdg','lis','lhr','mad','mrs','man','ams'], eeur: ['mxp','vie','fra','arn','waw','txl'],
  apac: ['sin','nrt','hkg','kix','tpe','icn'], oc: ['syd','akl','mel'],
  bunny: ['fra','mxp','vie','lhr'], tigris: ['ams','iad','nrt','sin','sjc'],
  kv: ['iad','gru','hkg','jnb','lhr','mad','nrt','ord','sin','sjc','syd'],
  fastlykv: ['gru','lhr','nrt','ord','sin','syd','fra'],
  objects: ['iad','ewr','jnb','ams','kix','lis','cdg','hkg','lhr','mad','nrt','ord','sin','sjc','syd'],
  apps: ['atl','mia','ewr','dfw','ord','iad','slc','pdx','las'],
  replicas: ['cdg','ord','sjc','sin','syd','fra'],
};
const entries: Experiment[] = [];
function add(id: string, provider: string, service: string, topic: string, operation: string, extra: Partial<Experiment> = {}) {
  entries.push({ id, provider, service, topic, operation, access: 'HTTPS', cache: 'Not established',
    probes: null, backend: 'Placement not established', warmup: 'Probe prewarm enabled',
    connection: 'Connection reuse enabled', requestsPerProbe: 1, network: 'Automatic IP family', ...extra });
}
const sizes = [['100b',100],['10kb',10000],['1mb',1000000]] as const;
for (const region of ['enam','wnam','weur','eeur','apac','oc']) {
  for (const op of ['upload','download']) for (const [size, bytes] of (region === 'weur' ? sizes : [sizes[1]])) {
    add(`cloudflare-r2-${region}-${op}-${size}`, 'Cloudflare','R2','storage',op === 'upload' ? 'Upload' : 'Download', {
      variant: region.toUpperCase(), payloadBytes: bytes, access: 'S3 API', probes: PROBES[region], backend: `Configured ${region.toUpperCase()} bucket`,
      warmup: 'S3 probe preparation', match: `s3:${region}:${op}:${bytes}`,
      note: op === 'download' ? 'Download object size follows configuration; deployed object contents are not verified.' : undefined,
    });
  }
}
for (const [prefix, provider, service, region, backend] of [
  ['aws-storage-enam','Amazon','S3','enam','us-east-1'],
  ['googlecloud-storage-enam','Google Cloud','Cloud Storage','enam','Eastern US (config description; exact bucket placement unverified)'],
  ['backblaze-b2-wnam','Backblaze','B2','wnam','us-west-004 endpoint'],
  ['xenyth-os-iad','Xenyth','Object Storage','enam','IAD endpoint'],
  ['fly-tigris','Tigris','Object Storage','tigris','Global service endpoint; object placement unknown'],
]) for (const op of ['upload','download']) add(`${prefix}-${op}-10kb`, provider,service,'storage',op === 'upload' ? 'Upload' : 'Download', {
  variant:region.toUpperCase(), payloadBytes:10000, access:'S3 API', probes: prefix === 'xenyth-os-iad' ? [...PROBES.enam,'yyz'] : PROBES[region], backend,
  warmup:'S3 probe preparation', network: prefix === 'xenyth-os-iad' ? 'IPv4' : 'Automatic IP family', match:`s3:${region}:${op}:10000`,
});
for (const [suffix, operation, access] of [['upload','Upload','HTTP storage API'],['s3upload','Upload','S3 API'],['s3download','Download','S3 API']])
  add(`bunny-ssdstorage-${suffix}-10kb`,'Bunny','SSD Storage','storage',operation,{payloadBytes:10000,access,probes:PROBES.bunny,backend:'Frankfurt primary',network:'IPv4',warmup:'Storage probe preparation',match: operation === 'Upload' ? 'bunny-upload-access' : undefined});
for (const region of ['enam','eeur']) add(`cloudflare-r2-${region}-upload-worker-10kb`,'Cloudflare','R2','storage','Upload',{
  variant:region.toUpperCase(),payloadBytes:10000,access:'Worker binding',probes:PROBES[region],backend:`Configured ${region.toUpperCase()} bucket`,warmup:'Upload probe preparation',
});
for (const [size,bytes] of sizes) add(`cloudflare-kv-upload-${size}`,'Cloudflare','KV','kv','Write',{
  payloadBytes:bytes,access:'Worker binding',probes:PROBES.kv,backend:'KV; backend placement not specified',cache:'Written key expires after 60 seconds',warmup:'Upload probe preparation',
});
add('fastly-kv-upload-10kb','Fastly','KV','kv','Write',{payloadBytes:10000,access:'Compute binding',probes:PROBES.fastlykv,network:'IPv4',warmup:'Upload probe preparation'});
for (const type of ['sqlite','kv']) add(`cloudflare-durableobjects-${type}-upload-10kb`,'Cloudflare',`Durable Objects · ${type === 'sqlite' ? 'SQLite' : 'KV'} storage`,'kv','Write',{
  payloadBytes:10000,access:'Worker → Durable Object',probes:PROBES.objects,backend:'Object identity determines placement; actual placement unverified',warmup:'Upload probe preparation',match:'do-storage-write',note:'Transaction and storage sync; includes the Worker-to-object request path.',
});
for (const [prefix,service] of [['cloudflare-d1','D1'],['turso-db','Turso']]) add(`${prefix}-enam-upload-worker-10kb`,prefix === 'cloudflare-d1' ? 'Cloudflare' : 'Turso',service,'sql','Write',{
  payloadBytes:10000,access:'Worker → database',probes:PROBES.enam,backend:'Configured eastern US database',warmup:service === 'D1' ? 'Database upload prewarm endpoint' : 'Upload probe preparation',
});
for (const [size,bytes] of sizes) add(`cloudflare-kv-uncached-${size}`,'Cloudflare','KV','kv','Read',{payloadBytes:bytes,access:'Worker binding',cache:'60-second cache TTL',backend:'KV; backend placement not specified'});
add('cloudflare-kv-cached-10kb','Cloudflare','KV','kv','Read',{payloadBytes:10000,access:'Worker binding',cache:'Long cache TTL',backend:'KV; backend placement not specified'});
for (const mode of ['cached','uncached']) {
  add(`cloudflare-r2-${mode}-10kb`,'Cloudflare','R2','storage','Read',{payloadBytes:10000,access:'Worker binding',cache:mode === 'cached' ? 'Cache API enabled' : 'Direct R2 read',backend:'Bucket selected by Worker location routing map'});
  add(`bunny-ssdstorage-${mode}-10kb`,'Bunny','SSD Storage','assets','Static asset delivery',{payloadBytes:10000,access:'CDN',network:'IPv4',cache:mode === 'cached' ? 'CDN caching enabled' : 'Configured cache bypass',backend:'Storage replicated across configured locations · Standard network'});
}
add('cloudflare-r2-uploadanddownload-enam-worker-10kb','Cloudflare','R2','storage','Read after upload',{payloadBytes:10000,access:'Worker binding',probes:PROBES.enam,backend:'Configured ENAM bucket',warmup:'Uploads a fresh per-location object before timed read',cache:'Intended direct read; deployed cache behavior requires verification',note:'Local R2 cache toggle checks parameter presence, so cache=false must not be interpreted as verified bypass.'});
add('bunny-highvolume-ssdstorage-cached-10kb','Bunny','SSD Storage · High Volume','assets','Static asset delivery',{payloadBytes:10000,access:'CDN',network:'IPv4',cache:'CDN caching enabled',backend:'Storage replicated across configured locations · High Volume network'});
for (const [id,provider,service] of [
  ['bunny-scripts-uncached-10kb','Bunny','Edge Scripting'],['fastly-compute-uncached-10kb','Fastly','Compute'],['cloudflare-worker-uncached-10kb','Cloudflare','Workers'],
]) add(id,provider,service,'compute','Code response',{payloadNote:'Nominal 10 kB response',cache:'Configured uncached response',backend:'Edge execution',network:provider === 'Cloudflare' ? 'Automatic IP family' : 'IPv4',requestsPerProbe:provider === 'Cloudflare' ? 5 : 1,plan:provider === 'Cloudflare' ? 'Enterprise' : undefined,match:'edge-code-10kb'});
for (const [suffix,plan,note] of [
  ['free-plan','Free',''],['free-plan-newips','Free','New IP rollout'],['pro-plan','Pro',''],['business-plan','Business',''],['argo','Free','Argo enabled'],['spectrum','Enterprise','Spectrum HTTPS'],
]) add(`cloudflare-worker-uncached-10kb-${suffix}`,'Cloudflare','Workers','compute','Code response',{payloadNote:'Nominal 10 kB response',plan,requestsPerProbe:5,routing:true,note,backend:'Edge execution',cache:'Configured uncached response'});
for (const [suffix,cache] of [['cached-10kb','Native response cache enabled'],['uncached-behind-cdn-10kb','Native response cache bypass (no-store)']])
  add(`cloudflare-worker-${suffix}`,'Cloudflare','Workers','caching','Code response',{payloadBytes:10240,requestsPerProbe:5,plan:'Enterprise',cache,backend:'Edge execution or native cache',note:'Local script payload is 10,240 bytes. Cached responses can bypass Worker execution.'});
for (const [id,service,cache] of [
  ['cloudflare-worker-uncached-hello-world-nokeepalive','Workers','Configured uncached response'],
  ['cloudflare-worker-cached-hello-world-nokeepalive','Workers','Native response cache enabled'],
  ['cloudflare-python-worker-uncached-hello-world-nokeepalive','Python Workers','Configured uncached response'],
]) add(id,'Cloudflare',service,'compute','Code response',{plan:'Enterprise',cache,backend:'Edge execution',warmup:'No probe warmup',connection:'Fresh connection',note:'Does not establish a cold runtime.'});
add('cloudflare-python-worker-uncached-hello-world','Cloudflare','Python Workers','compute','Code response',{plan:'Enterprise',backend:'Edge execution'});
add('aws-cloudfront-functions-helloworld','Amazon','CloudFront Functions','compute','Code response',{backend:'Edge execution',payloadNote:'Hello-world response; size unverified'});
add('cloudflare-secretsstore-binding-hello-world','Cloudflare','Secrets Store','kv','Read',{access:'Worker binding',plan:'Enterprise',payloadNote:'Small secret value; size unverified'});
for (const [id,service,access] of [['pages','Pages','Direct asset'],['workerassets','Workers Assets','Direct asset'],['workerassets-binding','Workers Assets','Worker → asset binding']])
  add(`cloudflare-${id}-uncached-10kb`,'Cloudflare',service,'assets','Static asset delivery',{payloadBytes:10000,access,backend:'Static asset service',cache:'Service-managed caching',plan:id === 'pages' ? undefined : 'Enterprise'});
add('fastly-kv-cached-10kb','Fastly','KV','kv','Read',{payloadBytes:10000,access:'Compute binding',network:'IPv4',cache:'Cache behavior not established by job name'});
add('cloudflare-durableobjects-uncached-10kb','Cloudflare','Durable Objects','kv','Fresh object response',{payloadBytes:10000,access:'Worker → Durable Object',backend:'New object identity per request; placement unverified',note:'Response test, not a storage read benchmark.'});
for (const region of ['enam','wnam','weur','eeur','apac','oc']) add(`cloudflare-d1-${region}-worker`,'Cloudflare','D1','sql','Simple query',{
  variant:region.toUpperCase(),access:'Worker binding',probes:region === 'eeur' ? PROBES.eeur.filter(p=>p!=='txl') : PROBES[region],backend:`Configured ${region.toUpperCase()} database`,warmup:'Database query prewarm endpoint',note:'Response size is not inferred from the job description.',
});
add('bunny-database-enam-script','Bunny','Database','sql','Query',{probes:PROBES.enam,access:'Edge script → database',backend:'ENAM per config naming; exact placement unverified',warmup:'Separate prewarm endpoint',note:'Supplied description incorrectly names D1; query equivalence requires verification.'});
for (const cold of [false,true]) add(`cloudflare-d1-read-replicas${cold ? '-coldstart' : ''}`,'Cloudflare','D1','sql','Replica query',{
  variant:cold ? 'Connection prewarm only' : 'Database prewarm',probes:cold ? PROBES.replicas : null,access:'Worker binding',backend:'ENAM primary; first-unconstrained replica session',warmup:cold ? 'Connection prewarm only; no database prewarm' : 'Database query prewarm',note:'No guarantee that individual requests encounter a cold database.',
});
add('turso-db-enam-worker','Turso','Turso','sql','Read',{probes:PROBES.enam,access:'Worker → database',backend:'Configured eastern US database',note:'Verify query/result equivalence before ranking against D1.'});
for (const [prefix,provider,service] of [['cloudflare-d1','Cloudflare','D1'],['turso-db','Turso','Turso']]) add(`${prefix}-enam-worker-storageselect`,provider,service,'sql','Expensive query',{
  probes:PROBES.enam,access:'Worker → database',backend:'Configured eastern US database',warmup:service === 'D1' ? 'Database query prewarm endpoint' : 'Probe prewarm enabled',note:'Query and warmup differences are descriptive; no automatic ranking.',
});
for (const [prefix,provider,service,backend] of [
  ['cloudflare-containers','Cloudflare','Containers','US; individual container placement unverified'],
  ['googlecloud-run','Google Cloud','Cloud Run','us-east4'],['aws-lambda','Amazon','Lambda','us-east-1'],['azure-containerapp','Microsoft Azure','Container Apps','eastus2'],
]) add(`${prefix}-uncached-hello-world`,provider,service,'applications','Hello-world application response',{
  probes:PROBES.apps,backend,match:'us-app-hello',note:'ASP.NET Core response after probe prewarm; includes network and hosting path.',
});
add('googlecloud-sql-uncached-hello-world','Google Cloud','Cloud Run + Cloud SQL','sql','Application database query',{backend:'us-central1 endpoint; database placement described by configuration',note:'Go application plus PostgreSQL; not the ASP.NET hello-world workload.'});
add('fly-tigris-uncached-10kb','Tigris','Public object delivery','assets','Static asset delivery',{payloadBytes:10000,backend:'Global service endpoint; object placement unknown',network:'Automatic IP family; ICN forced IPv4',cache:'Cache behavior unverified'});
export const EXPERIMENTS: ReadonlyMap<string, Experiment> = new Map(entries.map(e=>[e.id,e]));
export const experiment = (id: string) => EXPERIMENTS.get(id);
export function experimentLabel(e: Experiment) {
  return [e.provider,e.service,e.operation,e.payloadBytes ? (e.payloadBytes === 1000000 ? '1 MB' : e.payloadBytes === 10000 ? '10 kB' : `${e.payloadBytes.toLocaleString('en-US')} B`) : e.payloadNote,
    e.plan ? `${e.plan} zone` : '', e.cache !== 'Not established' ? e.cache : '',
    e.variant, e.connection === 'Fresh connection' ? 'Fresh connection' : '', e.note === 'New IP rollout' || e.note === 'Argo enabled' || e.note === 'Spectrum HTTPS' ? e.note : '',
    e.access].filter(Boolean).join(' · ');
}
export function experimentDetails(e: Experiment): string {
  return [e.operation, e.payloadBytes ? `${e.payloadBytes.toLocaleString('en-US')} bytes` : e.payloadNote, e.access,
    `Configured probes: ${e.probes ? e.probes.map(p=>p.toUpperCase()).join(', ') : 'all enabled locations'}`,
    `Backend: ${e.backend}`,e.cache,e.warmup,e.connection,e.network,`${e.requestsPerProbe} measured request(s) per probe per run`,e.plan ? `${e.plan} zone plan` : '',e.note,
  ].filter(Boolean).join(' · ');
}
/** null = all enabled; [] = no common eligible location. */
export function sharedProbes(ids: string[]): string[] | null {
  const definitions = ids.map(experiment);
  if (definitions.some(e=>!e)) return [];
  const restricted = definitions.flatMap(e=>e?.probes ? [e.probes] : []);
  return restricted.length ? restricted[0].filter(p=>restricted.every(list=>list.includes(p))) : null;
}
