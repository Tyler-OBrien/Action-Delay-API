/** Explicit probe pairs; cache names describe configuration, not guaranteed hits. */
export const CACHE_COMPARISONS = [
  {
    id: 'cache-r2', topic: 'storage', service: 'R2', label: 'R2: Cache API vs direct reads',
    description: 'How does caching affect response time for a 10 KB object?',
    context: 'Response time through the Worker, with the Cache API enabled or reading R2 directly. Cache API enabled does not guarantee a cache hit. These timings include the request path, not just the storage operation.',
    sources: [
      { id: 'cloudflare-r2-cached-10kb', label: 'Cache API enabled' },
      { id: 'cloudflare-r2-uncached-10kb', label: 'Direct R2 read' },
    ],
  },
  {
    id: 'cache-kv', topic: 'kv', service: 'KV', label: 'KV: Long vs short cache TTL',
    description: 'How does cache lifetime affect response time for a 10 KB value?',
    context: 'Response time through the Worker with a long cache TTL or a 60-second cache TTL. The short-TTL probe can still serve cached values; this is not a guaranteed cache-hit versus cache-miss comparison.',
    sources: [
      { id: 'cloudflare-kv-cached-10kb', label: 'Long cache TTL' },
      { id: 'cloudflare-kv-uncached-10kb', label: '60-second cache TTL' },
    ],
  },
];

export function cachingSource(id: string) {
  for (const comparison of CACHE_COMPARISONS) {
    const source = comparison.sources.find(s => s.id === id);
    if (source) return { ...source, service: comparison.service, context: comparison.context };
  }
  return null;
}

/** Only the complete, registered pair can vary cache configuration for ranking. */
export function cachingComparison(series: { sourceId: string; comparisonKey: string }[]) {
  if (series.length !== 2 || series.some(s => !/^perf:(averageResponseLatency|responseLatency):median:/.test(s.comparisonKey))) return null;
  if (new Set(series.map(s => (s as { observationScope?: string }).observationScope)).size !== 1) return null;
  return CACHE_COMPARISONS.find(c => c.sources.every(source => series.some(s => s.sourceId === source.id))) ?? null;
}
