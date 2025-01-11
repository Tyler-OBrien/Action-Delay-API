
import { Client as LibsqlClient, createClient } from "@libsql/client/web";

export interface Env {
	API_KEY: string;
	TURSO_URL?: string;
	TURSO_AUTH_TOKEN?: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		if ((request.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		const client = buildLibsqlClient(env);
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

			var output = await client.execute({sql: `INSERT OR REPLACE INTO Test (ID, test) VALUES (0, ?);`, args: [tryGetBuffer]})

			  var getDur = performance.now() - startReq;
			  if (output.rowsAffected == 0) {
				return new Response(`Error Turso PUT: Expected there to be one change but got ${output.rowsAffected}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			  }
			  
			  return new Response(`NewBoop`, {
				headers: {
					"x-adp-dur":  getDur.toString(),
				}
			});

			}
			catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error Turso PUT: ${exception}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			}
		}
		else if (request.method == "GET") {
			var startReq = performance.now();
			try {  
			var newRandomNum = crypto.randomUUID();
			var outputGet = await client.execute({sql: `Select ?1`, args: [newRandomNum]})
			  var getDur = performance.now() - startReq;
			  if (outputGet.rows.length == 0) {
				return new Response(`Error Turso GET: Did not return our input, returned no rows`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			  }
			  if (outputGet.rows[0].length == 0) {
				return new Response(`Error Turso GET: Did not return our input, returned empty row`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			  }
			  var newOutput = outputGet.rows[0][0].toString();
			  if (newOutput != newRandomNum) {
				return new Response(`Error Turso GET: Did not return our input, returned ${newOutput}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			  }
			  

			  return new Response(`NewBoop`, {
				headers: {
					"x-adp-dur":  getDur.toString(),
				}
			});

			}
			catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error Turso GET: ${exception}`, { status: 500, 	headers: {
					"x-adp-dur":  getDur.toString()
				} });
			}
		}

		return new Response("Method not supported", { status: 405})


	},
};


function buildLibsqlClient(env: Env): LibsqlClient {
	const url = env.TURSO_URL?.trim();
	if (url === undefined) {
	  throw new Error("TURSO_URL env var is not defined");
	}
  
	const authToken = env.TURSO_AUTH_TOKEN?.trim();
	if (authToken == undefined) {
	  throw new Error("TURSO_AUTH_TOKEN env var is not defined");
	}
  
	return createClient({ url, authToken });
  }