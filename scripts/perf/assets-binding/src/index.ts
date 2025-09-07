export interface Env {
	ASSETS: Fetcher;
}

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			var startReq = performance.now();
			var getRequest = await env.ASSETS.fetch(req);
			var getDur = performance.now() - startReq;
			var modifiable = new Response(getRequest.body, getRequest);
			modifiable.headers.set( "x-adp-dur", getDur.toString())
			return modifiable;
		}
		catch (exception) {
			console.log(exception);
			return new Response(`Error Static Assets GET: ${exception}`, { status: 500 });

		}
	},
};
