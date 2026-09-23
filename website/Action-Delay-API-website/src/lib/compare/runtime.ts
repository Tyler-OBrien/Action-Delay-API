// Small helpers shared by the /api/compare routes.

import { env } from "cloudflare:workers";

const bindings = env as unknown as Env;

/**
 * Where adp-proxy's GraphQL endpoint lives.
 *
 * In dev, a local `.env` wins. It has to: miniflare loads wrangler's `[vars]`
 * for `astro dev` as well as production, so taking the binding first would make
 * the production URL unconditional and leave no way to point at a proxy on
 * localhost. The override is gated on DEV so it cannot be used to redirect a
 * deployed Worker.
 */
export function graphqlEndpoint(): string {
  const local = import.meta.env.ADP_GRAPHQL_URL;
  const configured = import.meta.env.DEV && local ? local : bindings?.ADP_GRAPHQL_URL || local;
  if (!configured) throw new Error("ADP_GRAPHQL_URL is not configured");
  return configured;
}

export function ai(): Env["AI"] {
  const binding = bindings?.AI;
  if (!binding) throw new Error("the AI binding is not available");
  return binding;
}

/**
 * Pull the model's output out of an `AI.run()` result, regardless of which
 * response shape the model uses.
 *
 * Classic Workers AI text models return `{ response: string | object }`.
 * Newer OpenAI-compatible models (e.g. glm-5.3-flash) return a chat-completion
 * object instead: `{ choices: [{ message: { content: string } }] }`. Returns
 * `undefined` if neither shape yielded anything, so callers can tell "empty"
 * apart from "wrong shape" when logging.
 */
export function aiContent(response: any): unknown {
  if (response?.response !== undefined) return response.response;
  const message = response?.choices?.[0]?.message;
  if (message?.parsed !== undefined) return message.parsed;
  if (typeof message?.content === "string") return message.content;
  return undefined;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Read a JSON body with a size cap.
 *
 * These routes are reachable by anyone who can load the page, and every one of
 * them does real work downstream — a ClickHouse query or an inference call. The
 * cap is small because a legitimate request is a spec, not a payload.
 */
export async function readJson(request: Request, maxBytes = 64 * 1024): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new Error("request body is too large");
  }
  const text = await request.text();
  if (text.length > maxBytes) throw new Error("request body is too large");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("request body is not valid JSON");
  }
}
