export interface Env {
	DB: D1Database;
	API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var startReq = performance.now();
		try {
			var url = new URL(request.url);
			var newRandomNum = crypto.randomUUID();
			const session = env.DB.withSession('first-unconstrained');
			var outputGet = await session.prepare(`Select ?1, Key, Value from ReadTest`).bind(newRandomNum).all();
			var getDur = performance.now() - startReq;
			console.log(`got normal test request for ${url.pathname.slice(1)}, done in ${getDur}`);
			var newOutput = outputGet.results[0]['?1'].toString();
			if (newOutput != newRandomNum) {
				return new Response(`Error D1 GET: Did not return our input, returned ${newOutput}`, {
					status: 500,
					headers: {
						'x-adp-dur': getDur.toString(),
					},
				});
			}

			return new Response(JSON.stringify(outputGet), {
				headers: {
					'x-adp-dur': getDur.toString(),
					'x-db-internal-dur': outputGet.meta.duration.toString(),
				},
			});
		} catch (exception) {
			console.log(exception);
			var getDur = performance.now() - startReq;
			return new Response(`Error D1 GET: ${exception}`, {
				status: 500,
				headers: {
					'x-adp-dur': getDur.toString(),
				},
			});
		}
	},
};
