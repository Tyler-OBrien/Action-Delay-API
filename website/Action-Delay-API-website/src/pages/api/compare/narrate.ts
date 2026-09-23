import { benchmarkSource, benchmarkMetricNote, BENCHMARK_METHOD } from '../../../lib/compare/benchmarks';
import { experiment, experimentDetails } from '../../../lib/compare/experiments';
import { highlights } from "../../../lib/compare/facts";
// POST { facts } -> a sentence or two of plain English.
//
// The model receives *only* the computed summary — never the point arrays. Every
// number it can quote was calculated in facts.ts, so the failure mode is a
// clumsy sentence rather than an invented figure. It is also re-validated here:
// the body is re-derived into a compact shape rather than forwarded, so a caller
// cannot smuggle extra text into the prompt through an unexpected field.

import type { APIRoute } from "astro";
import { AI_COMPARE_ENABLED } from "../../../lib/compare/featureFlags";
import { ai, aiContent, json, readJson } from "../../../lib/compare/runtime";
import type { CompareFacts } from "../../../lib/compare/facts";

export const prerender = false;

const MODEL = "@cf/zai-org/glm-5.3-flash";

const UNIT_LABELS: Record<string, string> = {
  ms: "milliseconds",
  count: "occurrences",
  mhz: "MHz",
  kb: "KB",
  kbps: "KB/s",
  iops: "IOPS",
  score: "points",
};

const SYSTEM = `You describe a chart to someone looking at it.

Write at most two sentences. Say which series is higher or lower and by roughly how
much, and mention a clear trend only if one is present in the numbers.

Rules:
- Use ONLY the numbers given. Never estimate, extrapolate, or introduce a figure
  that is not in the input.
- These are statistics over time buckets, not over individual runs. Say "typically
  around X" rather than "the median run was X".
- If "mixedIntervals" is true, note that the series use different bucket widths.
- When rankingEligible is false, do not name winners or infer reliability. Follow measurementContext. Never call a bucket median a whole-window lifetime median.
- Respect metric direction: lower, higher, or neutral. Do not name a winner for neutral metrics, mixed metrics or units, missing series, or fewer than five buckets.
- Use plain language. Never use the word "bucket" or quote aggregation intervals such as "87 minutes". Say "chart values" or "reporting periods" when needed.
- No preamble, no bullet points, no markdown.`;

/**
 * Rebuild the facts into the minimum the model needs.
 *
 * Copying field by field is the point: it bounds the prompt, and it means an
 * attacker-supplied field on the posted object cannot become prompt text.
 */
function compact(facts: CompareFacts) {
  const comparison = highlights(facts);
  return {
    rankingEligible: comparison !== null && !comparison.weakSeparation,
    spanHours: Number(facts.spanHours) || 0,
    mixedIntervals: Boolean(facts.mixedIntervals),
    series: (facts.series ?? []).slice(0, 12).map((s) => ({
      label: String(s.label ?? "").slice(0, 300),
      unit: UNIT_LABELS[s.unit] ?? String(s.unit ?? ""),
      rankingEligible: s.rankingEligible === true,
      measurementContext: String(s.measurementContext ?? "").slice(0, 500),
      experiment: experiment(String(s.sourceId)) ? experimentDetails(experiment(String(s.sourceId))!) : undefined,
      benchmark: s.comparisonKey?.startsWith('yabs:') ? benchmarkSource(s.sourceId) : undefined,
      benchmarkMethod: s.comparisonKey?.startsWith('yabs:') ? BENCHMARK_METHOD : undefined,
      metricContext: s.comparisonKey?.startsWith('yabs:') ? benchmarkMetricNote(s.comparisonKey.split(':')[1]) : undefined,
      direction: s.direction,
      comparisonKey: s.comparisonKey,
      p10: s.p10,
      p90: s.p90,
      buckets: Number(s.buckets) || 0,
      typical: s.typical,
      min: s.min,
      max: s.max,
      trendPercent: s.trendPercent,
      bucketMinutes: Number(s.intervalMinutes) || 0,
    })),
    comparisons: (facts.pairs ?? []).slice(0, 12).map((p) => ({
      series: String(p.a ?? "").slice(0, 300),
      versus: String(p.b ?? "").slice(0, 300),
      difference: p.difference,
      percent: p.percent,
      sharePeriodsHigher: p.aHigherShare,
    })),
  };
}

export const POST: APIRoute = async ({ request }) => {
  if (!AI_COMPARE_ENABLED) return json({ error: "AI explanations are temporarily disabled" }, 503);

  let body: any;
  try {
    body = await readJson(request, 32 * 1024);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "bad request" }, 400);
  }

  const facts = body?.facts;
  if (!facts || typeof facts !== "object" || !Array.isArray(facts.series) || facts.series.length === 0) {
    return json({ error: "facts with at least one series are required" }, 400);
  }

  let binding: Env["AI"];
  try {
    binding = ai();
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "not configured" }, 503);
  }

  try {
    const response = await binding.run(MODEL, {
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(compact(facts as CompareFacts)) },
      ],
      max_completion_tokens: 200,
      temperature: 0.2,
    });
    const content = aiContent(response);
    const text = typeof content === "string" ? content.trim() : "";
    if (!text) {
      console.error(
        `compare/narrate: empty response from ${MODEL}`,
        JSON.stringify({ keys: Object.keys(response ?? {}), contentType: typeof content })
      );
      return json({ error: "no summary was produced" }, 502);
    }
    return json({ text });
  } catch (err) {
    console.error(`compare/narrate: ${MODEL} call failed`, err instanceof Error ? err.message : String(err));
    return json(
      { error: `could not summarize: ${err instanceof Error ? err.message : String(err)}` },
      502
    );
  }
};
