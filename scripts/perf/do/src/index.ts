import { DurableObject } from 'cloudflare:workers';

interface Env {
	DO: DurableObjectNamespace<import('./index').PerfDO>;
	PerfDOKV: AnalyticsEngineDataset;
	API_KEY: string;
}


const file = "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"
globalThis.blobFile = b64toBlob(file)

//https://stackoverflow.com/questions/27980612/converting-base64-to-blob-in-javascript
function b64toBlob(base64) {
    
    var byteString = atob(base64);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
}

/** A Durable Object's behavior is defined in an exported Javascript class */
export class PerfDO extends DurableObject {
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

		var incomingPath = new URL(request.url);
		if (incomingPath.pathname == "/no-op") {
			return new Response("ok", { status: 200})
		}
		return new Response(globalThis.blobFile);
	}
}

export default {
	async fetch(request, env: Env, ctx) {
		if ((request.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		if (request.method != "GET") {
			return new Response("Method Not Allowed, Bad Human.", {
				status: 405,
			});
		}

		let coloId = new URL(request.url).pathname.slice(1);
		if (coloId.length == 0) {
			return new Response("404", { status: 404})
		}
		const id = env.DO.idFromName(coloId + crypto.randomUUID());

		// Retry behavior can be adjusted to fit your application.
		let maxAttempts = 3;
		let baseBackoffMs = 0;
		let maxBackoffMs = 10;
		let attempt = 0;
		let error: any = null;
		try {
			while (true) {
				// Try sending the request
				try {
					// Create a Durable Object stub for each attempt, because certain types of
					// errors will break the Durable Object stub.
					var startReq = performance.now();
					const doStub = env.DO.get(id);
					var doResponse = await doStub.fetch(request.url, {
						method: request.method
				   });					
				   var getDur = performance.now() - startReq;
					return new Response(doResponse.body, {
						headers: {
							"x-adp-dur":  getDur.toString()
						}
					})
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
			return new Response(`Error DO KV: ${exception}`, { status: 500 });
		}
	},

} satisfies ExportedHandler<Env>;
