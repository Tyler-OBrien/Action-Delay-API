/**
 * Spaghetti code to proxy a request via a DO for consistent colo
 */

export interface Env {
	DO: DurableObjectNamespace;
	APIKEY: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);


		if (request.headers.get("APIKEY") !== env.APIKEY) {
			return new Response("Invalid API key", { status: 403 });
		}

		const objectName = url.pathname.split("/").pop(); // Assumes the DO name is the last part of the path
	  
		if (!objectName) {
		  return new Response("Object name must be provided in the path", { status: 400 });
		}
	  
		const objectId = env.DO.idFromName(objectName);
		const durableObject = env.DO.get(objectId);
		const newUrl = new URL("https://literallyanything/");
		newUrl.searchParams.set("url", url.searchParams.get("url") as string);
	  
		var response = await durableObject.fetch(new Request(newUrl, { method: "GET" }));	

		let proxyHeaders: Headers = new Headers(response.headers);

		if (response.headers.has("Age")) {
			proxyHeaders.set("Proxy-Age", response.headers.get("Age") || '');
		}
		
		if (response.headers.has("Cf-Cache-Status")) {
			proxyHeaders.set("Proxy-CF-Cache-Status", response.headers.get("Cf-Cache-Status") || '');
		}

		if (response.headers.has("colo")) {
			proxyHeaders.set("proxy-colo", response.headers.get("colo") || '');
		}

		if (response.headers.has("metal")) {
			proxyHeaders.set("proxy-metal", response.headers.get("metal") || '');
		}

		if (response.headers.has("date")) {
			proxyHeaders.set("proxy-date", response.headers.get("date") || '');
		}

		if (response.headers.has("content-type")) {
			proxyHeaders.set("proxy-content-type", response.headers.get("content-type") || '');
		}

		if (response.headers.has("zone")) {
			proxyHeaders.set("proxy-zone", response.headers.get("zone") || '');
		}

		if (response.headers.has("alt-svc")) {
			proxyHeaders.set("proxy-alt-svc", response.headers.get("alt-svc") || '');
		}


		proxyHeaders.set("Proxy-DO", objectName || '')
		proxyHeaders.set("Proxy-DO-URL", url.searchParams.get("url") as string || '')
		proxyHeaders.set("Proxy", "true")
		

		return new Response(response.body, {
			headers: proxyHeaders
		})
	},
};


export class DO {

	state: DurableObjectState;
	env: Env;
	createdAt: number;
  
	constructor(state: DurableObjectState, env: Env) {
	  this.state = state;
	  this.env = env;
	  this.createdAt = Date.now();
	}
	async fetch(request: Request) {
	  const url = new URL(request.url).searchParams.get("url");
	  
	  if (!url) {
		return new Response("url query parameter is required", { status: 400 });
	  }
	  
  
	  return fetch(url, {
		headers: {
			"do-age" : `${Date.now() - this.createdAt}`
		}
	  });
	}
  }