import type { StatusConfig } from "../../models/types";

/**
 * Single source of truth for how jobs are grouped across the site.
 *
 * - `DELAY_CATEGORIES` drives both the status dashboard and the /delay listing.
 * - `statusConfig` is derived from it and keeps the exact shape the SignalR
 *   client (`src/scripts/signalr-status-code.js`) expects on `globalThis.config`
 *   ({ groups: [{ name, items: [{ name, jobName }] }] }). Do not change that shape.
 * - `groupJobs()` buckets a fetched job list into ordered, browsable sections for
 *   the /delay, /perf and /ai listing pages.
 */

export interface JobLike {
  internalJobName: string;
  jobName: string;
}

export interface JobGroup<T extends JobLike> {
  /** Stable key (used for default-open logic / DOM hooks). */
  key: string;
  /** Display name shown in the section header. */
  name: string;
  jobs: T[];
}

interface DelayCategory {
  key: string;
  name: string;
  /** Member jobs, with their human-friendly status-dashboard label. */
  items: { jobName: string; name: string }[];
}

/** Ordered delay-job categories. `jobName` here is the job's internalJobName. */
export const DELAY_CATEGORIES: DelayCategory[] = [
  {
    key: "workers",
    name: "Cloudflare Workers",
    items: [
      { jobName: "worker", name: "Workers Deploy Delay" },
      { jobName: "cron", name: "Workers Cron Delay" },
      { jobName: "wfp", name: "Workers for Platforms Deploy Delay" },
      { jobName: "workerlogs", name: "Worker Logs Delay" },
    ],
  },
  {
    key: "dns",
    name: "DNS",
    items: [
      { jobName: "dns", name: "Paid DNS Update Delay" },
      { jobName: "dnsfree", name: "Free DNS Update Delay" },
    ],
  },
  {
    key: "rules",
    name: "Rules",
    items: [
      { jobName: "waf", name: "Custom Rule (WAF) Update Delay" },
      { jobName: "pagerule", name: "Page Rule Update Delay" },
    ],
  },
  {
    key: "cache",
    name: "Cache",
    items: [{ jobName: "purge", name: "Single URL Cache Purge Delay" }],
  },
  {
    key: "ssl",
    name: "SSL & Certificates",
    items: [
      { jobName: "cert", name: "Certificate Renewal Delay" },
      { jobName: "customhostnames", name: "CF for SaaS (Custom Hostnames) Setup Delay" },
    ],
  },
  {
    key: "analytics",
    name: "Analytics",
    items: [
      { jobName: "analytics", name: "Zone Analytics Delay" },
      { jobName: "workeranalytics", name: "Worker Analytics Delay" },
      { jobName: "logpush", name: "Logpush Delay" },
    ],
  },
];

/** Jobs that exist in the API but should never be shown to users. */
export const HIDDEN_JOBS = new Set<string>(["workertesting"]);

/**
 * Status-dashboard config, derived from DELAY_CATEGORIES.
 * Shape is consumed by signalr-status-code.js — keep it stable.
 */
export const statusConfig: StatusConfig = {
  groups: DELAY_CATEGORIES.map((c) => ({
    name: c.name,
    items: c.items.map((i) => ({ name: i.name, jobName: i.jobName })),
  })),
};

/** internalJobName -> category, for fast delay lookups. */
const DELAY_CATEGORY_BY_JOB = new Map<string, DelayCategory>();
for (const cat of DELAY_CATEGORIES) {
  for (const item of cat.items) DELAY_CATEGORY_BY_JOB.set(item.jobName, cat);
}

const OTHER_KEY = "other";
const OTHER_NAME = "Other";

/** Pretty names for known perf providers (first segment of internalJobName). */
const PERF_PROVIDER_NAMES: Record<string, string> = {
  cloudflare: "Cloudflare",
  bunny: "Bunny",
  aws: "AWS",
  azure: "Azure",
  googlecloud: "Google Cloud",
  fastly: "Fastly",
  fly: "Fly.io",
  backblaze: "Backblaze",
  turso: "Turso",
  xenyth: "Xenyth",
};

/** Pretty names for known AI model authors (second segment of @cf//@hf/ name). */
const AI_AUTHOR_NAMES: Record<string, string> = {
  meta: "Meta",
  "meta-llama": "Meta",
  mistral: "Mistral",
  mistralai: "Mistral",
  qwen: "Qwen",
  google: "Google",
  openai: "OpenAI",
  deepseek: "DeepSeek",
  "deepseek-ai": "DeepSeek",
  moonshotai: "Moonshot AI",
  baai: "BAAI",
  thebloke: "TheBloke",
  microsoft: "Microsoft",
  nvidia: "NVIDIA",
  "ai4bharat": "AI4Bharat",
  deepgram: "Deepgram",
  tiiuae: "TII",
  tinyllama: "TinyLlama",
  nexusflow: "Nexusflow",
  openchat: "OpenChat",
  fblgit: "FBL",
  nousresearch: "Nous Research",
  "zai-org": "Z.ai",
  "myshell-ai": "MyShell",
  pfnet: "PFN",
  "huggingface": "Hugging Face",
};

function titleCase(s: string): string {
  return s
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Provider bucket for a perf job: first dash-delimited segment of its name. */
export function perfProvider(job: JobLike): { key: string; name: string } {
  const seg = (job.internalJobName || job.jobName).toLowerCase().split("-")[0];
  if (!seg) return { key: OTHER_KEY, name: OTHER_NAME };
  return { key: seg, name: PERF_PROVIDER_NAMES[seg] ?? titleCase(seg) };
}

/**
 * Ordered workload categories for the /perf comparison tables. The /perf page
 * groups by these (cross-provider) so e.g. R2 / S3 / GCS / B2 line up together.
 * "Other" is a safety net (currently never hit) and always renders last.
 */
export const PERF_WORKLOAD_ORDER = [
  "Compute & Functions",
  "Object Storage",
  "Key-Value",
  "SQL & Databases",
  OTHER_NAME,
] as const;

/**
 * First-match-wins service/category rules, matched against the full
 * internalJobName. ORDER MATTERS — more specific tokens must come before generic
 * ones (Durable Objects before bare `kv`; `*-storage`/`ssdstorage` before bare
 * tokens). Validated against the full live perf job list (0 unclassified).
 */
const PERF_WORKLOAD_RULES: [RegExp, string, string][] = [
  [/durableobjects/, "Durable Objects", "Key-Value"],
  [/(^|-)kv(-|$)/, "KV", "Key-Value"],
  [/(^|-)r2(-|$)/, "R2", "Object Storage"],
  [/(^|-)d1(-|$)/, "D1", "SQL & Databases"],
  [/edgedb/, "EdgeDB", "SQL & Databases"],
  [/turso/, "Turso", "SQL & Databases"],
  [/googlecloud-sql/, "Cloud SQL", "SQL & Databases"],
  [/aws-storage/, "S3", "Object Storage"],
  [/googlecloud-storage/, "Cloud Storage", "Object Storage"],
  [/ssdstorage/, "SSD Storage", "Object Storage"],
  [/(^|-)b2(-|$)/, "B2", "Object Storage"],
  [/tigris/, "Tigris", "Object Storage"],
  [/xenyth-os/, "Object Storage", "Object Storage"],
  [/lambda/, "Lambda", "Compute & Functions"],
  [/cloudfront-functions/, "CloudFront Functions", "Compute & Functions"],
  [/googlecloud-run/, "Cloud Run", "Compute & Functions"],
  [/containerapp/, "Container Apps", "Compute & Functions"],
  [/magiccontainers/, "Magic Containers", "Compute & Functions"],
  [/(^|-)containers(-|$)/, "Containers", "Compute & Functions"],
  [/(^|-)scripts(-|$)/, "Edge Scripting", "Compute & Functions"],
  [/(^|-)compute(-|$)/, "Compute", "Compute & Functions"],
  [/(^|-)pages(-|$)/, "Pages", "Compute & Functions"],
  [/workerassets/, "Worker Assets", "Compute & Functions"],
  [/python-worker/, "Python Workers", "Compute & Functions"],
  [/(^|-)worker(-|$)/, "Workers", "Compute & Functions"],
];

/** Workload classification for a perf job: its category, service, and provider. */
export function perfWorkload(job: JobLike): {
  category: string;
  service: string;
  provider: string;
} {
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const provider = perfProvider(job).name;
  for (const [rx, service, category] of PERF_WORKLOAD_RULES) {
    if (rx.test(name)) return { category, service, provider };
  }
  // Fallback: second segment as a best-effort service label.
  const seg = name.split("-")[1] ?? "";
  return { category: OTHER_NAME, service: seg ? titleCase(seg) : OTHER_NAME, provider };
}

/**
 * Service-identifying internalJobName tokens to drop when building a variant
 * label, keyed by the service from perfWorkload(). These name the service itself
 * (already shown by the parent), so they're removed wherever they appear. Tokens
 * that distinguish variants are deliberately NOT listed — e.g. `worker`/`s3*`
 * (worker-binding vs S3) and `highvolume` (high-volume vs normal SSD storage).
 */
const PERF_SERVICE_LEAD: Record<string, string[]> = {
  "Durable Objects": ["durableobjects"],
  KV: ["kv"],
  R2: ["r2"],
  D1: ["d1"],
  EdgeDB: ["edgedb"],
  Turso: ["db"],
  "Cloud SQL": ["sql"],
  S3: ["storage"],
  "Cloud Storage": ["storage"],
  "SSD Storage": ["ssdstorage"],
  B2: ["b2"],
  Tigris: ["tigris"],
  "Object Storage": ["os"],
  Lambda: ["lambda"],
  "CloudFront Functions": ["cloudfront", "functions"],
  "Cloud Run": ["run"],
  "Container Apps": ["containerapp"],
  "Magic Containers": ["magiccontainers"],
  Containers: ["containers"],
  "Edge Scripting": ["scripts"],
  Compute: ["compute"],
  Pages: ["pages"],
  "Worker Assets": ["workerassets"],
  "Python Workers": ["python", "worker"],
  Workers: ["worker"],
};

const PERF_OP_TOKENS = new Set(["upload", "download", "uploadanddownload"]);

/** Read/write operation for a perf job, used to split a service into parents. */
function perfOperation(name: string): "" | "Download" | "Upload" | "Up+Down" {
  if (name.includes("uploadanddownload")) return "Up+Down";
  const up = name.includes("upload");
  const down = name.includes("download");
  if (up && down) return "Up+Down";
  if (up) return "Upload";
  if (down) return "Download";
  return "";
}

/**
 * Variant classification for a perf job: the parent it groups under (provider +
 * service + operation) and a short region·size·method label for the child row.
 * Used by PerfTable.astro to collapse near-duplicate jobs (R2 across regions/
 * sizes) into one expandable parent.
 */
export function perfVariant(job: JobLike): {
  category: string;
  service: string;
  provider: string;
  operation: "" | "Download" | "Upload" | "Up+Down";
  parentKey: string;
  parentLabel: string;
  variantLabel: string;
} {
  const { category, service, provider } = perfWorkload(job);
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const operation = perfOperation(name);
  const parentLabel = operation ? `${service} ${operation}` : service;
  const parentKey = `${provider}|${service}|${operation}`;

  // Drop the provider segment, the read/write op tokens, and the service's own
  // identifying tokens (wherever they appear); what's left is the variant.
  const strip = new Set(PERF_SERVICE_LEAD[service] ?? []);
  const toks = name
    .split("-")
    .slice(1)
    .filter((t) => !PERF_OP_TOKENS.has(t) && !strip.has(t));
  const variantLabel = toks.length ? toks.map(titleCase).join(" · ") : "default";

  return { category, service, provider, operation, parentKey, parentLabel, variantLabel };
}

/** Author/family bucket for an AI job: the `@cf/<author>/...` segment. */
export function aiAuthor(job: JobLike): { key: string; name: string } {
  const name = (job.internalJobName || job.jobName).toLowerCase();
  // Format: @cf/<author>/<model> or @hf/<author>/<model>
  const parts = name.replace(/^@/, "").split("/");
  const author = parts.length >= 3 ? parts[1] : parts[0];
  if (!author) return { key: OTHER_KEY, name: OTHER_NAME };
  return { key: author, name: AI_AUTHOR_NAMES[author] ?? titleCase(author) };
}

/** Model-name prefixes hardcoded into the top "Popular Models" AI group. */
const AI_POPULAR_MODEL_PREFIXES = ["kimi-", "glm-"];
const AI_POPULAR_KEY = "popular";
const AI_POPULAR_NAME = "Popular Models";

/** True if an AI job's model (last "/" segment) matches a hardcoded popular prefix. */
export function isPopularAiModel(job: JobLike): boolean {
  const model = (job.internalJobName || job.jobName).toLowerCase().split("/").pop() ?? "";
  return AI_POPULAR_MODEL_PREFIXES.some((p) => model.startsWith(p));
}

export type JobGroupingType = "delay" | "perf" | "ai";

/**
 * Group a fetched job list into ordered, browsable sections.
 * - delay: by DELAY_CATEGORIES (defined order), unknown jobs in "Other".
 * - perf:  by provider, Cloudflare first then alphabetical.
 * - ai:    by model author/family, alphabetical.
 * Hidden jobs are dropped. Within each group, jobs are sorted alphabetically.
 */
export function groupJobs<T extends JobLike>(
  jobs: T[],
  type: JobGroupingType
): JobGroup<T>[] {
  const visible = jobs.filter((j) => !HIDDEN_JOBS.has(j.internalJobName));

  if (type === "delay") {
    const buckets = new Map<string, T[]>();
    for (const job of visible) {
      const cat = DELAY_CATEGORY_BY_JOB.get(job.internalJobName);
      const key = cat ? cat.key : OTHER_KEY;
      (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(job);
    }
    const groups: JobGroup<T>[] = [];
    for (const cat of DELAY_CATEGORIES) {
      const list = buckets.get(cat.key);
      if (list && list.length) {
        groups.push({ key: cat.key, name: cat.name, jobs: sortJobs(list) });
      }
    }
    const other = buckets.get(OTHER_KEY);
    if (other && other.length) {
      groups.push({ key: OTHER_KEY, name: OTHER_NAME, jobs: sortJobs(other) });
    }
    return groups;
  }

  // perf: bucket by workload category, emit in PERF_WORKLOAD_ORDER (Other last).
  if (type === "perf") {
    const buckets = new Map<string, T[]>();
    for (const job of visible) {
      const { category } = perfWorkload(job);
      (buckets.get(category) ?? buckets.set(category, []).get(category)!).push(job);
    }
    const groups: JobGroup<T>[] = [];
    for (const category of PERF_WORKLOAD_ORDER) {
      const list = buckets.get(category);
      if (list && list.length) {
        groups.push({ key: category, name: category, jobs: sortJobs(list) });
      }
    }
    return groups;
  }

  // ai: a hardcoded "Popular Models" group first, then by author (alphabetical, Other last).
  const popular = visible.filter(isPopularAiModel);
  const rest = visible.filter((j) => !isPopularAiModel(j));

  const names = new Map<string, string>();
  const buckets = new Map<string, T[]>();
  for (const job of rest) {
    const { key, name } = aiAuthor(job);
    names.set(key, name);
    (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(job);
  }

  const keys = [...buckets.keys()].sort((a, b) => {
    if (a === OTHER_KEY) return 1;
    if (b === OTHER_KEY) return -1;
    return (names.get(a) ?? a).localeCompare(names.get(b) ?? b);
  });

  const groups: JobGroup<T>[] = [];
  if (popular.length) {
    groups.push({ key: AI_POPULAR_KEY, name: AI_POPULAR_NAME, jobs: sortJobs(popular) });
  }
  for (const key of keys) {
    groups.push({ key, name: names.get(key) ?? key, jobs: sortJobs(buckets.get(key)!) });
  }
  return groups;
}

function sortJobs<T extends JobLike>(jobs: T[]): T[] {
  return [...jobs].sort((a, b) =>
    a.internalJobName.localeCompare(b.internalJobName)
  );
}
