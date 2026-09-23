// POST { text } -> a validated CompareSpec.
//
// The model's only job is to turn a sentence into a *proposal*. It never writes
// GraphQL, never names a table, and never picks a time range in absolute terms.
// What it emits is checked against the catalog by validateSpec() before anything
// is built, so the worst a bad or adversarial prompt can do is fail validation.
//
// Two deliberate narrowings of what it has to get right:
//
//   - **Dates.** It emits `rangeDays`, a number, and the window is computed here.
//     Models are unreliable at "what was the date 3 weeks ago" and a wrong answer
//     is a silently wrong chart rather than an error.
//   - **Regions.** It emits region codes; the location lists are expanded here.
//     Otherwise the prompt would have to carry ~300 location names for it to
//     copy accurately, which it would not.

import type { APIRoute } from "astro";
import { FAMILIES, LIMITS, REGION_NAMES, REGION_ORDER } from "../../../lib/compare/catalog";
import { HIDDEN_JOBS } from "../../../data/jobCategories";
import { AI_COMPARE_ENABLED } from "../../../lib/compare/featureFlags";
import { groupLocationsByRegion } from "../../../lib/compare/presets";
import { ai, aiContent, json, readJson } from "../../../lib/compare/runtime";
import { validateSpec } from "../../../lib/compare/spec";

export const prerender = false;

const API_BASE = "https://delay.cloudflare.chaika.me";

/** Needs reliable json_schema adherence for SPEC_SCHEMA below — verify after any model change. */
const MODEL = "@cf/zai-org/glm-5.3-flash";

const MAX_TEXT_LENGTH = 500;

/**
 * How many job names of each type go into the prompt.
 *
 * Truncation is a real hazard rather than a theoretical one: perf and AI both sit
 * near a hundred jobs and the AI catalog only grows. A job the prompt omits is
 * invisible — the user asks about a model that exists and is told it is not one
 * of the options — so the cap is set well above the current counts, hidden jobs
 * are dropped first so the budget is spent on things that can actually be
 * charted, and truncation reports itself instead of happening quietly.
 */
const MAX_JOBS_PER_TYPE = 250;

interface JobList {
  names: string[];
  /** How many were dropped to fit the prompt. Zero in the normal case. */
  truncated: number;
}

async function jobNames(type: string): Promise<JobList> {
  try {
    const resp = await fetch(`${API_BASE}/v2/jobs/type/${type}`);
    if (!resp.ok) return { names: [], truncated: 0 };
    const body = await resp.json();
    const jobs = (body?.data ?? []) as { internalJobName?: string }[];
    const all = jobs
      .map((j) => j.internalJobName)
      .filter((n): n is string => typeof n === "string" && n.length > 0 && !HIDDEN_JOBS.has(n));
    return { names: all.slice(0, MAX_JOBS_PER_TYPE), truncated: Math.max(0, all.length - MAX_JOBS_PER_TYPE) };
  } catch {
    return { names: [], truncated: 0 };
  }
}

async function locationsByRegion(): Promise<Map<string, string[]>> {
  try {
    const resp = await fetch(`${API_BASE}/v2/locations`);
    if (!resp.ok) return new Map();
    const body = await resp.json();
    return groupLocationsByRegion(body?.data ?? []);
  } catch {
    return new Map();
  }
}

function catalogSummary(): string {
  return FAMILIES.map((f) => {
    const metrics = f.metrics
      .map((m) => `${m.id} (${m.label}; ops: ${Object.keys(m.fields).join("/")})`)
      .join(", ");
    const dims = f.dimensions.map((d) => d.id).join(", ");
    return `- ${f.id}: ${f.description}\n    metrics: ${metrics}\n    dimensions: ${dims}`;
  }).join("\n");
}

const SPEC_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    rangeDays: { type: "number" },
    series: {
      type: "array",
      items: {
        type: "object",
        properties: {
          family: { type: "string", enum: FAMILIES.map((f) => f.id) },
          metric: { type: "string" },
          op: { type: "string", enum: ["median", "avg", "min", "max", "count"] },
          groupBy: { type: "string" },
          label: { type: "string" },
          filters: {
            type: "object",
            properties: {
              jobName: { type: "array", items: { type: "string" } },
              locationName: { type: "array", items: { type: "string" } },
              region: { type: "array", items: { type: "string", enum: REGION_ORDER } },
              source: { type: "array", items: { type: "string" } },
              errorHash: { type: "array", items: { type: "string" } },
            },
          },
        },
        required: ["family", "metric", "op"],
      },
    },
  },
  required: ["series", "rangeDays"],
};

function systemPrompt(jobs: Record<string, string[]>, regions: string[]): string {
  return `You turn a question about monitoring data into a comparison specification.

Available data:
${catalogSummary()}

Job names by type:
- workersDelay / workersDelayLocations / apiErrors use: ${jobs.delay.join(", ") || "(none)"}
- perf / perfLocations / apiErrorsPerf use: ${jobs.perf.join(", ") || "(none)"}
- ai / aiLocations / apiErrorsAi use: ${jobs.ai.join(", ") || "(none)"}

Regions: ${regions.map((r) => `${r} (${REGION_NAMES[r] ?? r})`).join(", ") || "(none)"}

Rules:
- Produce at most ${LIMITS.maxRootFields} entries in "series".
- To compare several jobs of the SAME family, emit ONE series entry with
  groupBy:"jobName" and filters.jobName listing them. Do not emit one entry per job.
- To compare regions, emit ONE entry PER region with filters.region set to that single
  region code, and do NOT set groupBy. Use a *Locations family. Set "label" to the
  region name.
- To compare different families, emit one entry per family.
- Use only the family, metric, op, dimension and job names listed above. Never invent one.
- "rangeDays" is how many days back to look. Use 7 unless the question implies otherwise.
- Prefer op "median". Use "count" only for the "errors" metric.

Answer only with the specification.`;
}

/**
 * Expand `filters.region` into the location names that region covers.
 *
 * Not a dimension the endpoint knows about — it is sugar over a location filter.
 * The expansion has to happen before validateSpec(), which would otherwise
 * reject `region` as an unknown dimension.
 *
 * Every path out of here must leave the entry *narrower*, never wider. Removing
 * `region` without putting a location filter in its place would turn "how is
 * Antarctica doing" into a query over every location on earth, still labeled
 * Antarctica — a wrong answer that looks like a right one. So a region that
 * resolves to nothing writes an empty `locationName`, which validateSpec
 * rejects, rather than no filter at all.
 */
export function expandRegions(raw: any, byRegion: Map<string, string[]>): string[] {
  const problems: string[] = [];
  if (!Array.isArray(raw?.series)) return problems;

  for (const entry of raw.series) {
    const filters = entry?.filters;
    if (!filters || !Array.isArray(filters.region)) continue;

    const names: string[] = [];
    for (const code of filters.region) {
      const locations = byRegion.get(String(code).toUpperCase());
      if (!locations?.length) {
        problems.push(
          `unknown region ${JSON.stringify(code)} — known regions: ${[...byRegion.keys()].join(", ")}`
        );
        continue;
      }
      names.push(...locations);
    }
    delete filters.region;

    // A location filter the model also set wins over the region expansion only
    // where they overlap; anything else would silently widen an explicit filter.
    const existing: string[] = Array.isArray(filters.locationName) ? filters.locationName : [];
    const merged = existing.length ? existing.filter((n: string) => names.includes(n)) : names;
    filters.locationName = [...new Set(merged)];
  }
  return problems;
}

export const POST: APIRoute = async ({ request }) => {
  if (!AI_COMPARE_ENABLED) return json({ error: "AI comparisons are temporarily disabled" }, 503);

  let body: any;
  try {
    body = await readJson(request, 8 * 1024);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "bad request" }, 400);
  }

  const text = String(body?.text ?? "").trim();
  if (!text) return json({ error: "text is required" }, 400);
  if (text.length > MAX_TEXT_LENGTH) {
    return json({ error: `text must be at most ${MAX_TEXT_LENGTH} characters` }, 400);
  }

  let binding: Env["AI"];
  try {
    binding = ai();
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "not configured" }, 503);
  }

  const [cloudflare, google, perf, aiJobs, byRegion] = await Promise.all([
    jobNames("CloudflareDelay"),
    jobNames("GoogleDelay"),
    jobNames("Perf"),
    jobNames("ai"),
    locationsByRegion(),
  ]);
  const delay = { names: [...new Set([...cloudflare.names, ...google.names])], truncated: cloudflare.truncated + google.truncated };
  const dropped = delay.truncated + perf.truncated + aiJobs.truncated;
  if (dropped > 0) {
    // Not fatal, but the model is now choosing from an incomplete list and the
    // resulting "no such job" would otherwise be indistinguishable from a typo.
    console.warn(`compare/interpret: ${dropped} job names omitted from the prompt (cap ${MAX_JOBS_PER_TYPE}/type)`);
  }
  const regions = REGION_ORDER.filter((r) => (byRegion.get(r)?.length ?? 0) > 0);

  let proposal: any;
  try {
    const response = await binding.run(MODEL, {
      messages: [
        { role: "system", content: systemPrompt({ delay: delay.names, perf: perf.names, ai: aiJobs.names }, regions) },
        { role: "user", content: text },
      ],
      response_format: { type: "json_schema", json_schema: SPEC_SCHEMA },
      max_completion_tokens: 1200,
      temperature: 0,
    });
    const content = aiContent(response);
    if (content === undefined) {
      throw new Error(
        `empty response from ${MODEL} (keys: ${Object.keys(response ?? {}).join(", ") || "none"})`
      );
    }
    proposal = typeof content === "string" ? JSON.parse(content) : content;
  } catch (err) {
    console.error(`compare/interpret: ${MODEL} call failed`, err instanceof Error ? err.message : String(err));
    return json(
      { error: `could not interpret that: ${err instanceof Error ? err.message : String(err)}` },
      502
    );
  }

  const regionProblems = expandRegions(proposal, byRegion);

  // rangeDays is the model's; the window is ours.
  const days = Math.min(Math.max(Number(proposal?.rangeDays) || 7, 1), LIMITS.maxSpanDays);
  const now = Date.now();
  const candidate = {
    title: proposal?.title,
    from: new Date(now - days * 86_400_000).toISOString(),
    to: new Date(now).toISOString(),
    series: proposal?.series,
  };

  const result = validateSpec(candidate, now);
  if (!result.ok) {
    console.error(
      `compare/interpret: ${MODEL} proposal failed validation`,
      JSON.stringify({ errors: result.errors, proposal })
    );
    return json(
      {
        error: "could not turn that into a valid comparison",
        details: [...regionProblems, ...result.errors],
      },
      422
    );
  }

  if (regionProblems.length > 0) {
    // The spec validated, but only because the unresolved region became an empty
    // location filter somewhere. Refusing here keeps a half-understood question
    // from being answered with a confident-looking chart.
    return json({ error: "could not turn that into a valid comparison", details: regionProblems }, 422);
  }
  return json({ spec: result.spec });
};
