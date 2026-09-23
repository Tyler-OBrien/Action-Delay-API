/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Bindings declared in wrangler.toml.
 *
 * Reached through `import { env } from "cloudflare:workers"`, not
 * `Astro.locals.runtime.env` — that was removed in Astro v6 / @astrojs/cloudflare
 * v13, where `locals.runtime` carries only `cfContext`.
 */
interface Env {
  /** Workers AI. Used only by the /api/compare/* routes. */
  AI: {
    run(model: string, input: Record<string, unknown>): Promise<any>;
  };
  /**
   * adp-proxy's GraphQL endpoint. Called server-side only — the browser talks to
   * this site's own origin, so the endpoint needs no CORS handling and need not
   * be publicly reachable.
   */
  ADP_GRAPHQL_URL?: string;
}

/**
 * The Workers runtime provides this module; its types ship in
 * `@cloudflare/workers-types`, which is only a transitive dependency here and so
 * is not resolvable from the project root under pnpm. Declaring the one export
 * this project uses is smaller and safer than adding a `types` entry that would
 * change type resolution across the whole site.
 */
declare module "cloudflare:workers" {
  export const env: Env;
}
