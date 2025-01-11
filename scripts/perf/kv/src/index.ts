export interface Env {
	KV: KVNamespace;
	API_KEY: string;
	AE: AnalyticsEngineDataset;
}

const handler = {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if ((req.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		if (req.method != "GET" && req.method != "PUT") {
			return new Response("Method Not Allowed, Bad Human.", {
				status: 405,
			});
		}
		var url = new URL(req.url);
		if (req.method === "PUT") {
			if (req.body == null) {
				return new Response("No Body but put", {
					status: 400,
				});
			}
			const key = url.pathname.slice(1);

			if (key.startsWith("cached") || key.startsWith("uncached")) {
				return new Response("cached and uncached dirs are protected.", {
					status: 401,
				});
			}
			try {
				var startReq = performance.now();
				await env.KV.put(key, req.body, {
					expirationTtl: 60
				});
				var getDur = performance.now() - startReq;
				try {
					if (env.AE)
						env.AE.writeDataPoint({
							blobs: [],
							doubles: [getDur],
							indexes: [key],
						});
				}
				catch (exception) {
					console.log(exception)
				}
				return new Response(null, { status: 200, headers: { "x-adp-dur": getDur.toString() } });
			}
			catch (exception) {
				console.log(exception);
				return new Response(`Error KV PUT: ${exception}`, { status: 500 });

			}

		}

		if (url.pathname.startsWith('/cached/')) {
			if (url.pathname === '/cached/500kb') {
				return await getKeyResponse(env.KV, 'cached/500Kb-new', 31536001, env.AE);
			} else if (url.pathname === '/cached/5mb') {
				return await getKeyResponse(env.KV, 'cached/5mb', 31536001, env.AE);
			} else if (url.pathname === '/cached/10kb') {
				return await getKeyResponse(env.KV, 'cached/10Kb-new', 31536001, env.AE);
			}
		}
		if (url.pathname.startsWith('/uncached/')) {
			if (url.pathname === '/uncached/500kb') {
				return await getKeyResponse(env.KV, 'uncached/500Kb', 60, env.AE);
			} else if (url.pathname === '/uncached/5mb') {
				return await getKeyResponse(env.KV, 'uncached/5mb', 60, env.AE);
			} else if (url.pathname === '/uncached/10kb') {
				return await getKeyResponse(env.KV, 'uncached/10Kb', 60, env.AE);
			}
		}
		return new Response('404, Bad Robot.', { status: 404 });
	},
};


const getKeyResponse = async function (kv: KVNamespace, key: string, cacheTtl: number, AE: AnalyticsEngineDataset): Promise<Response> {
	var startReq = performance.now();

	try {
		var startReq = performance.now();
		var tryGet = await kv.get(key, { cacheTtl: cacheTtl, type: 'arrayBuffer' });
		var getDur = performance.now() - startReq;
		try {
			if (AE)
				AE.writeDataPoint({
					blobs: [],
					doubles: [getDur, cacheTtl],
					indexes: [key],
				});
		}
		catch (exception) {
			console.log(exception)
		}
		if (tryGet === null) {
			return new Response("Could not get key: " + key, {
				status: 404,
				headers: {
					"x-adp-dur": getDur.toString()
				}
			});
		}
		return new Response(tryGet, {
			headers: {
				"x-adp-dur": getDur.toString()
			}
		})
	}
	catch (exception) {
		var getDur = performance.now() - startReq;
		console.log(exception);
		return new Response(`Error KV GET: ${exception}`, {
			status: 500, headers: {
				"x-adp-dur": getDur.toString()
			}
		});
	}
}

export default handler;