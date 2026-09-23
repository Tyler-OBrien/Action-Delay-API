import { isLifetime, runLifetime } from "../../lib/compare/lifetime";
// POST { spec } -> validated, executed, and summarized.
//
// This is the only route that reaches adp-proxy, and validateSpec() is the only
// way in. Nothing here trusts the caller: the spec is checked against the
// catalog before a document is built, and the identifiers in that document come
// from the catalog rather than from the request.

import type { APIRoute } from "astro";
import { computeFacts } from "../../lib/compare/facts";
import { runCompare } from "../../lib/compare/gql";
import { graphqlEndpoint, json, readJson } from "../../lib/compare/runtime";
import { usesRawOnlyDimension, validateSpec } from "../../lib/compare/spec";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await readJson(request);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "bad request" }, 400);
  }

  const result = validateSpec(body?.spec ?? body);
  if (result.ok === false) {
    return json({ error: "invalid comparison", details: result.errors }, 400);
  }
  const spec = result.spec;

  let endpoint: string;
  try {
    endpoint = graphqlEndpoint();
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "not configured" }, 503);
  }

  try {
    const lifetime = isLifetime(spec) ? await runLifetime(spec, endpoint) : null;
    const compare = lifetime ?? await runCompare(spec, endpoint);
    const warnings = [...compare.warnings];

    if (usesRawOnlyDimension(spec)) {
      // adp-proxy falls back to the raw table for these, which is correct but
      // scans far more over a wide window. Say so rather than let it look hung.
      warnings.push(
        "This comparison groups by a dimension the rollups cannot answer, so it reads the raw table and may be slow over long ranges."
      );
    }

    return json({
      ...(lifetime ? { lifetimeThresholdsUnavailable: lifetime.lifetimeThresholdsUnavailable, lifetimeSummary: lifetime.lifetimeSummary, lifetimeSummaryUnavailable: lifetime.lifetimeSummaryUnavailable } : {}),
      spec,
      series: compare.series,
      facts: computeFacts(compare.series, spec.from, spec.to),
      intervalMinutes: compare.intervalMinutes,
      tiers: compare.tiers,
      warnings,
    });
  } catch (err) {
    // runCompare surfaces adp-proxy's own messages, which are already written to
    // be safe to show a caller — the endpoint sanitizes upstream detail before
    // it leaves the proxy.
    console.error(
      "compare: adp-proxy call failed",
      JSON.stringify({ endpoint, seriesCount: spec.series.length, error: err instanceof Error ? err.message : String(err) })
    );
    return json({ error: err instanceof Error ? err.message : "query failed" }, 502);
  }
};
