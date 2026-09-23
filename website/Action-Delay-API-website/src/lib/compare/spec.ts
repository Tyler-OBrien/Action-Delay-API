// The comparison request format, and the validator that stands between untrusted
// input and a generated ClickHouse query.
//
// Everything that reaches buildQuery() has been through validateSpec(). That
// matters most for the natural-language route: a model proposes a spec, and this
// is what decides whether it describes something real. Unknown families, metrics,
// ops and dimensions are *rejected*, never repaired — a "helpful" fallback to the
// nearest valid field would answer a question nobody asked, with a chart that
// looks authoritative.

import {
  FAMILIES,
  LIMITS,
  findDimension,
  findFamily,
  findMetric,
  pointField,
  type Op,
} from "./catalog";

/**
 * One root field of the GraphQL query.
 *
 * Two ways to produce multiple chart lines:
 *   - `groupBy` returns one line per distinct value of that dimension, from a
 *     single ClickHouse query. Preferred: the buckets align by construction.
 *   - several CompareSeriesSpec entries, each its own root field. Needed to
 *     compare across families, and for regions, where each line is a *set* of
 *     locations merged server-side.
 */
export interface CompareSeriesSpec {
  family: string;
  metric: string;
  op: Op;
  /** Dimension id -> allowed values. An empty array is rejected, not widened. */
  filters?: Record<string, string[]>;
  /** Dimension id to expand into one line per distinct value. */
  groupBy?: string;
  /** Display name. Only used when `groupBy` is absent, where one entry is one line. */
  label?: string;
}

export interface CompareSpec {
  title?: string;
  /** ISO 8601. */
  from: string;
  to: string;
  maxPoints?: number;
  series: CompareSeriesSpec[];
}

export type ValidationResult =
  | { ok: true; spec: CompareSpec }
  | { ok: false; errors: string[] };

const VALID_OPS: Op[] = ["median", "avg", "min", "max", "count"];

/**
 * Budget for filter values across one spec, in serialized bytes.
 *
 * The thing that actually has to hold is adp-proxy's 64KB `maxBodyBytes`:
 * exceeding it returns an opaque "query too large", which is the failure this
 * check exists to turn into a message naming the problem. A count-based cap
 * cannot promise that — 1200 values at the length limit below is nearly 240KB —
 * so the budget is measured in bytes, leaving room for the rest of the document.
 *
 * There is plenty of headroom: all seven regions together are 63 IATA-style
 * location names, well under a kilobyte.
 */
const MAX_FILTER_BYTES = 32 * 1024;

/** Long enough for any job, model or location name; short enough to bound one value. */
const MAX_FILTER_VALUE_LENGTH = 120;

export const DEFAULT_MAX_POINTS = 500;

function parseTime(value: unknown, field: string, errors: string[]): number | null {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${field} is required and must be an ISO 8601 string`);
    return null;
  }
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) {
    errors.push(`${field} is not a valid date: ${JSON.stringify(value)}`);
    return null;
  }
  return ms;
}

/**
 * Check a spec against the catalog and return a normalized copy.
 *
 * Normalization is limited to things with one obviously-right answer: clamping
 * maxPoints, clamping a `to` in the future back to now, and dropping absent
 * optional fields. Anything that names something is checked, not corrected.
 */
export function validateSpec(input: unknown, now: number = Date.now()): ValidationResult {
  const errors: string[] = [];

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, errors: ["spec must be an object"] };
  }
  const raw = input as Record<string, unknown>;

  const fromMs = parseTime(raw.from, "from", errors);
  let toMs = parseTime(raw.to, "to", errors);

  if (fromMs !== null && toMs !== null) {
    // A range ending in the future is a normal thing for a model to produce for
    // "the last 7 days"; clamp rather than reject.
    if (toMs > now) toMs = now;
    if (fromMs >= toMs) {
      errors.push("from must be earlier than to");
    } else {
      const spanDays = (toMs - fromMs) / 86_400_000;
      if (spanDays > LIMITS.maxSpanDays) {
        errors.push(
          `range is ${Math.round(spanDays)} days, which exceeds the ${LIMITS.maxSpanDays}-day limit`
        );
      }
    }
  }

  let maxPoints = DEFAULT_MAX_POINTS;
  if (raw.maxPoints !== undefined) {
    const n = Number(raw.maxPoints);
    if (!Number.isFinite(n)) {
      errors.push("maxPoints must be a number");
    } else {
      maxPoints = Math.min(Math.max(Math.round(n), 1), LIMITS.maxPoints);
    }
  }

  if (!Array.isArray(raw.series) || raw.series.length === 0) {
    errors.push("series must be a non-empty array");
    return { ok: false, errors };
  }
  if (raw.series.length > LIMITS.maxRootFields) {
    errors.push(
      `${raw.series.length} series exceeds the ${LIMITS.maxRootFields} the endpoint allows in one request`
    );
  }

  let filterBytes = 0;
  const series: CompareSeriesSpec[] = [];

  raw.series.forEach((entry, i) => {
    const at = `series[${i}]`;
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      errors.push(`${at} must be an object`);
      return;
    }
    const s = entry as Record<string, unknown>;

    const family = findFamily(String(s.family ?? ""));
    if (!family) {
      errors.push(
        `${at}.family ${JSON.stringify(s.family)} is not one of: ${FAMILIES.map((f) => f.id).join(", ")}`
      );
      return;
    }

    const op = String(s.op ?? "") as Op;
    if (!VALID_OPS.includes(op)) {
      errors.push(`${at}.op ${JSON.stringify(s.op)} is not one of: ${VALID_OPS.join(", ")}`);
      return;
    }

    const metricId = String(s.metric ?? "");
    const metric = findMetric(family, metricId);
    if (!metric) {
      errors.push(
        `${at}.metric ${JSON.stringify(s.metric)} is not a metric of ${family.id}; available: ${family.metrics
          .map((m) => m.id)
          .join(", ")}`
      );
      return;
    }
    if (!pointField(family, metricId, op)) {
      errors.push(
        `${at}: ${family.id}.${metricId} does not support ${op}; available: ${Object.keys(metric.fields).join(", ")}`
      );
      return;
    }

    const out: CompareSeriesSpec = { family: family.id, metric: metricId, op };

    if (s.groupBy !== undefined && s.groupBy !== null && s.groupBy !== "") {
      const dim = findDimension(family, String(s.groupBy));
      if (!dim) {
        errors.push(
          `${at}.groupBy ${JSON.stringify(s.groupBy)} is not a dimension of ${family.id}; available: ${family.dimensions
            .map((d) => d.id)
            .join(", ")}`
        );
      } else {
        out.groupBy = dim.id;
      }
    }

    if (s.filters !== undefined && s.filters !== null) {
      if (typeof s.filters !== "object" || Array.isArray(s.filters)) {
        errors.push(`${at}.filters must be an object`);
      } else {
        const filters: Record<string, string[]> = {};
        for (const [key, value] of Object.entries(s.filters as Record<string, unknown>)) {
          const dim = findDimension(family, key);
          if (!dim) {
            errors.push(
              `${at}.filters.${key} is not a dimension of ${family.id}; available: ${family.dimensions
                .map((d) => d.id)
                .join(", ")}`
            );
            continue;
          }
          if (!Array.isArray(value) || value.length === 0) {
            // adp-proxy renders an empty list as `1 = 0`, so this would run a
            // query guaranteed to return nothing. Almost always a mistake.
            errors.push(`${at}.filters.${key} must be a non-empty array of values`);
            continue;
          }
          const values = value.map((v) => String(v));
          if (values.some((v) => v.length === 0 || v.length > MAX_FILTER_VALUE_LENGTH)) {
            errors.push(`${at}.filters.${key} contains an empty or oversized value`);
            continue;
          }
          filterBytes += values.reduce((n, v) => n + v.length + 4, 0);
          filters[dim.id] = values;
        }
        if (Object.keys(filters).length > 0) out.filters = filters;
      }
    }

    if (typeof s.label === "string" && s.label.trim()) {
      out.label = s.label.trim().slice(0, 120);
    }

    series.push(out);
  });

  if (filterBytes > MAX_FILTER_BYTES) {
    errors.push(
      `filter values total roughly ${Math.round(filterBytes / 1024)}KB, over the ${MAX_FILTER_BYTES / 1024}KB limit`
    );
  }

  if (errors.length > 0) return { ok: false, errors };

  const spec: CompareSpec = {
    from: new Date(fromMs as number).toISOString(),
    to: new Date(toMs as number).toISOString(),
    maxPoints,
    series,
  };
  if (typeof raw.title === "string" && raw.title.trim()) {
    spec.title = raw.title.trim().slice(0, 200);
  }
  return { ok: true, spec };
}

/**
 * Does this spec force adp-proxy onto the raw table?
 *
 * Correct either way, but slower over wide ranges, so the UI says so rather than
 * letting a 90-day error-hash comparison look like it hung.
 */
export function usesRawOnlyDimension(spec: CompareSpec): boolean {
  return spec.series.some((s) => {
    const family = findFamily(s.family);
    if (!family) return false;
    const names = [s.groupBy, ...Object.keys(s.filters ?? {})].filter(Boolean) as string[];
    return names.some((n) => findDimension(family, n)?.rawOnly);
  });
}
