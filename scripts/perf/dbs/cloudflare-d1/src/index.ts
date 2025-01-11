export interface Env {
	DB: D1Database;
	API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		if ((request.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		if (request.method == "PUT") {

			if (!request.headers.get("content-length")) {
				return new Response("Must have a body to be uploaded", { status: 400})
			}
			var tryGetBuffer = await request.arrayBuffer();
			if (tryGetBuffer.byteLength != 10000) {
				return new Response(`Uploaded content must be byte length of 10,000, you sent ${tryGetBuffer.byteLength}`, { status: 400})
			}

			var startReq = performance.now();
			try {
			var output = await env.DB.prepare(`INSERT OR REPLACE INTO Test (ID, test) VALUES (0, ?1);`).bind(tryGetBuffer).run()

			  var getDur = performance.now() - startReq;
			  if (output.meta.changes == 0) {
				return new Response(`Error D1 PUT: Expected there to be one change but got ${output.meta.changes}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			  }
			  
			  return new Response(`NewBoop`, {
				headers: {
					"x-adp-dur":  getDur.toString(),
					"x-db-internal-dur": output.meta.duration.toString(),
				}
			});

			}
			catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error D1 PUT: ${exception}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			}
		}
		else if (request.method == "GET") {
			var startReq = performance.now();
			try {  
			var newRandomNum = crypto.randomUUID();
			var outputGet = await env.DB.prepare(`Select ?1`).bind(newRandomNum).all()
			  var getDur = performance.now() - startReq;
			  var newOutput = outputGet.results[0]["?1"].toString();
			  if (newOutput != newRandomNum) {
				return new Response(`Error D1 GET: Did not return our input, returned ${newOutput}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			  }
			  
			  return new Response(`NewBoop`, {
				headers: {
					"x-adp-dur":  getDur.toString(),
					"x-db-internal-dur": outputGet.meta.duration.toString(),
				}
			});

			}
			catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error D1 GET: ${exception}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			}
		}

		return new Response("Method not supported", { status: 405})


	},
};
