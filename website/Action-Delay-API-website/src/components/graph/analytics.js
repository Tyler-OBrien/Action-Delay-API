// Shared normalization for the /v2 analytics responses.
//
// Two things in the raw response will wreck a chart if plotted verbatim:
//
//  1. When a job has a run in flight, the API appends a synthetic trailing point carrying
//     `undeployed: true` and the run's elapsed-so-far. That is not comparable to the
//     completed run lengths in every other bucket, and because `undeployed` serializes
//     ahead of the metric properties, any code picking "the first key that isn't
//     timePeriod" reads `true` and plots a 1. Drop these points.
//
//  2. The ClickHouse queries bucket with toStartOfInterval() but filter on
//     `run_time > start and run_time < end`, so the first and last buckets are only
//     partially covered by the requested window — often a single run. A one-sample median
//     sitting at the end of the line reads as a spike. Drop those buckets too; the API
//     hands us `groupByMinutesInterval` to identify them.

// Metrics are requested in PascalCase ("MedianRunLength") and come back camelCased
// ("medianRunLength").
export function metricKey(metric) {
  return metric.charAt(0).toLowerCase() + metric.slice(1);
}

// A bucket is only trustworthy when the requested window covers the whole interval.
export function isCompleteBucket(point, intervalMs, start, end) {
  const bucketStart = new Date(point.timePeriod).getTime();
  return bucketStart >= start && bucketStart + intervalMs <= end;
}

// Points minus the in-flight run and minus partially-covered edge buckets. Callers pass
// the same window they requested from the API.
export function completeBuckets(data, start, end) {
  const intervalMs = (data?.groupByMinutesInterval ?? 0) * 60_000;
  return (data?.points ?? []).filter(
    // Without an interval we can't tell a partial bucket from a whole one, so keep
    // everything rather than silently emptying the chart.
    (p) => !p.undeployed && (!intervalMs || isCompleteBucket(p, intervalMs, start, end))
  );
}

// The common case: one metric out of an analytics response, as [{x, y}].
export function seriesFromResponse(data, metric, start, end) {
  const key = metricKey(metric);
  return completeBuckets(data, start, end)
    .map((p) => ({
      x: new Date(p.timePeriod).getTime(),
      y: Number(p[key] ?? p[metric]),
    }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}
