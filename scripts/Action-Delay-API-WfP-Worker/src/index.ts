export interface Env {
	dispatcher: DispatchNamespace 
}
export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const worker = env.dispatcher.get("main");
			return await worker.fetch(req);	
		} catch (e: any) {
			if (e.message.startsWith('Worker not found')) {
				// we tried to get a worker that doesn't exist in our dispatch namespace
				return new Response(e.message, { status: 404 });
			}

			// this could be any other exception from `fetch()` *or* an exception
			// thrown by the called worker (e.g. if the dispatched worker has
			// `throw MyException()`, you could check for that here).
			return new Response(e.message, { status: 500 });
		}
	},
};

