import { DurableObject } from 'cloudflare:workers';

interface Env {
	SqliteDO: DurableObjectNamespace<import('./index').PerfDOSqlite>;
	PerfDOKV: AnalyticsEngineDataset;
	API_KEY: string;
}

/** A Durable Object's behavior is defined in an exported Javascript class */
export class PerfDOSqlite extends DurableObject {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.toml
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * The Durable Object exposes an RPC method sayHello which will be invoked when when a Durable
	 *  Object instance receives a request from a Worker via the same method invocation on the stub
	 *
	 * @param name - The name provided to a Durable Object instance from a Worker
	 * @returns The greeting to be sent back to the Worker
	 */
	async fetch(request: Request) {
		let sql = this.ctx.storage.sql;

		var incomingPath = new URL(request.url);
		if (incomingPath.pathname == "/no-op") {
			return new Response("ok", { status: 200})
		}

		if (incomingPath.pathname == "/test-read") {
			return new Response(JSON.stringify(sql.exec("Select 1").toArray()), { status: 200})
		}
		if (incomingPath.pathname == "/test-read2") {
			return new Response(JSON.stringify(sql.exec("Select * from Test").toArray()), { status: 200})
		}
		if (incomingPath.pathname == "/test-read3") {
			var triedquery = sql.exec("Select test from Test").raw();
			var tryGetVal = triedquery.next().value[0] as ArrayBuffer;
			return new Response(tryGetVal)
		}
		if (incomingPath.pathname == "/test-delete") {
			return new Response(JSON.stringify(sql.exec("Drop table Test").toArray()), { status: 200})
		}

		
		var response = sql.exec(`CREATE TABLE IF NOT EXISTS Test (
  ID INTEGER PRIMARY KEY,
  test BLOB
);

INSERT OR REPLACE INTO Test (ID, test) VALUES (0, ?1);`, await request.arrayBuffer())
		return new Response("Done!", { status: 200})
	}
}

export default {
	async fetch(request, env: Env, ctx) {
		if ((request.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		if (request.method != "PUT") {
			return new Response("Method Not Allowed, Bad Human.", {
				status: 405,
			});
		}

		let coloId = new URL(request.url).pathname.slice(1);
		if (coloId.length == 0) {
			return new Response("404", { status: 404})
		}
		if (request.headers.get("DO") != null) {
			coloId = request.headers.get("DO")!;
		}
		const id = env.SqliteDO.idFromName(coloId);

		// Retry behavior can be adjusted to fit your application.
		let maxAttempts = 3;
		let baseBackoffMs = 0;
		let maxBackoffMs = 10;
		let data = await request.arrayBuffer()
		let attempt = 0;
		let error: any = null;
		try {
			while (true) {
				// Try sending the request
				try {
					// Create a Durable Object stub for each attempt, because certain types of
					// errors will break the Durable Object stub.
					var startReq = performance.now();
					const doStub = env.SqliteDO.get(id);
					var doResponse = await doStub.fetch(request.url, {
						body: data,
						method: request.method
				   });							
				   var getDur = performance.now() - startReq;
					return new Response(doResponse.body, {
						headers: {
							"x-adp-dur":  getDur.toString()
						}
					});
				} catch (e: any) {
					if (!e.retryable) {
						// Failure was not a transient internal error, so don't retry.
						throw e;
					}
					error = e;
				}
				let backoffMs = Math.min(maxBackoffMs, baseBackoffMs * Math.random() * Math.pow(2, attempt));
				attempt += 1;
				if (attempt >= maxAttempts) {
					// Reached max attempts, so don't retry.
					throw error;
				}
				await scheduler.wait(backoffMs);
			}
		} catch (exception) {
			console.log(exception);
			return new Response(`Error DO Sqlite: ${exception}`, { status: 500 });
		}
	},

} satisfies ExportedHandler<Env>;
