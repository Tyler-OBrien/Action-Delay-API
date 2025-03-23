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
				return new Response("Nothing here", { status: 404})
			}
			let worker: Fetcher | null = null;
			if (!parseUrl.searchParams.has("scriptName"))
			{
			worker = env.dispatcher.get("main");
			}
			else {
			 worker = env.dispatcher.get(parseUrl.searchParams.get("scriptName")!);
			}
			var tryGetWorkerResp =  await worker.fetch(req);	
			var newHeaders = new Headers(tryGetWorkerResp.headers);
			newHeaders.set("x-adap-dur", (performance.now() - startReq).toString() )
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

			return new Response(tryGetWorkerResp.body, {
				headers: newHeaders
			})
		} catch (e: any) {
			if (e.message.startsWith('Worker not found')) {
				// we tried to get a worker that doesn't exist in our dispatch namespace
				return new Response(e.message, { status: 200, headers: {
					'x-adp-dur': (performance.now() - startReq).toString(),
				} });
			}

			// this could be any other exception from `fetch()` *or* an exception
			// thrown by the called worker (e.g. if the dispatched worker has
			// `throw MyException()`, you could check for that here).
			return new Response(e.message, { status: 500, headers: {
				'x-adp-dur': (performance.now() - startReq).toString(),
			}  });
		}
	},
};

