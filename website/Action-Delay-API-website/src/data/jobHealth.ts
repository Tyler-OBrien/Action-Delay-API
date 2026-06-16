// Maps a job's current state to a health level used to color its headline value.
// Kept deliberately small and signal-driven so the SignalR scripts can mirror it
// (see the matching logic in src/scripts/signalr-*.js).

export type Health = "good" | "elevated" | "bad";

interface JobHealthInput {
  currentRunStatus?: string;
  lastRunStatus?: string;
  currentRunLengthMs?: number;
  predictedRunStatus?: string;
  type?: string;
}

/** Resolve a job (+ optional active-incident flag) to a health level. */
export function jobHealth(job: JobHealthInput, hasIncident = false): Health {
  // Hard error: API failing now, or predicted to error.
  if (
    (job.currentRunStatus === "API_Error" && job.lastRunStatus === "API_Error") ||
    job.predictedRunStatus === "API_Error"
  ) {
    return "bad";
  }

  // Elevated: an active incident, a delayed job, or an in-progress run already
  // running notably long.
  if (
    hasIncident ||
    job.type === "delayed" ||
    job.predictedRunStatus === "Delayed" ||
    (job.currentRunStatus === "Undeployed" && (job.currentRunLengthMs ?? 0) > 30000)
  ) {
    return "elevated";
  }

  return "good";
}

/** The CSS utility class (`.value-good|elevated|bad`) for a job's headline value. */
export function healthValueClass(job: JobHealthInput, hasIncident = false): string {
  return "value-" + jobHealth(job, hasIncident);
}

/** Tailwind background class for a small status dot, by health level. */
export function dotClass(health: Health): string {
  return health === "good"
    ? "bg-green-500"
    : health === "elevated"
    ? "bg-amber-500"
    : "bg-red-500";
}
