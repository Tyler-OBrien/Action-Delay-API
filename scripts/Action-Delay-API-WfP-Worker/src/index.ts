export interface Env {
	dispatcher: DispatchNamespace
	AE: AnalyticsEngineDataset
}
export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var startReq = performance.now();
		var parseUrl = new URL(req.url);
		try {
			if (parseUrl.pathname != "/") {
				return new Response("Nothing here", { status: 404 })
			}
			let worker: Fetcher | null = null;
			if (!parseUrl.searchParams.has("scriptName")) {
				worker = env.dispatcher.get("main");
			}
			else {
				worker = env.dispatcher.get(parseUrl.searchParams.get("scriptName")!);
			}

			// 30 retries with 100 ms timeout
			let tryGetWorkerResp: Response;
			for (let i = 0; i < 30; i++) {
				try {
					const controller = new AbortController();
					const timeout = setTimeout(() => controller.abort(), 100);
					try {
						tryGetWorkerResp = await worker.fetch(req, { signal: controller.signal });
						break;
					} finally {
						clearTimeout(timeout);  // Always clear
					}
				} catch (error) {
					if (i === 29) throw error;
				}
			}


			var newHeaders = new Headers(tryGetWorkerResp!.headers);
			newHeaders.set("x-adap-dur", (performance.now() - startReq).toString())
			try {
				if (env.AE)
					env.AE.writeDataPoint({
						blobs: [req.cf.colo],
						doubles: [performance.now() - startReq],
						indexes: [`wfp`],
					});
			}
			catch (exception) {
				console.log(exception)
			}

			return new Response(tryGetWorkerResp!.body, {
				headers: newHeaders
			})
		} catch (e: any) {
			if (e.message.startsWith('Worker not found')) {
				return new Response(e.message, {
					status: 200, headers: {
						'x-adp-dur': (performance.now() - startReq).toString(),
					}
				});
			}

			return new Response(e.message, {
				status: 500, headers: {
					'x-adp-dur': (performance.now() - startReq).toString(),
				}
			});
		}
	},
};