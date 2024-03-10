export interface Env {
	dispatcher: DispatchNamespace 
}
export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
			return await worker.fetch(req, {
				cf: {
					image: {
						width: 90,
						onerror: "true",
					}
				}
			});	
		} catch (e: any) {
			if (e.message.startsWith('Worker not found')) {
				// we tried to get a worker that doesn't exist in our dispatch namespace
				return new Response(e.message, { status: 200 });
			}

			// this could be any other exception from `fetch()` *or* an exception
			// thrown by the called worker (e.g. if the dispatched worker has
			// `throw MyException()`, you could check for that here).
			return new Response(e.message, { status: 500 });
		}
	},
};

