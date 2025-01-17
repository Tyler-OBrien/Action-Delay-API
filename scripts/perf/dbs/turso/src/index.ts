import { Client as LibsqlClient, createClient } from '@libsql/client/web';

export interface Env {
	API_KEY: string;
	TURSO_URL?: string;
	TURSO_URL2?: string;
	TURSO_AUTH_TOKEN?: string;
	TURSO_AUTH_TOKEN2: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var url = new URL(request.url);
		if ((request.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		const client = buildLibsqlClient(env, url.pathname == '/storageselect');
		if (request.method == 'PUT') {
			if (!request.headers.get('content-length')) {
				return new Response('Must have a body to be uploaded', { status: 400 });
			}
			var tryGetBuffer = await request.arrayBuffer();
			if (tryGetBuffer.byteLength != 10000) {
				return new Response(`Uploaded content must be byte length of 10,000, you sent ${tryGetBuffer.byteLength}`, { status: 400 });
			}

			var startReq = performance.now();
			try {
				var output = await client.execute({ sql: `INSERT OR REPLACE INTO Test (ID, test) VALUES (0, ?);`, args: [tryGetBuffer] });

				var getDur = performance.now() - startReq;
				if (output.rowsAffected == 0) {
					return new Response(`Error Turso PUT: Expected there to be one change but got ${output.rowsAffected}`, {
						status: 500,
						headers: {
							'x-adp-dur': getDur.toString(),
						},
					});
				}

				return new Response(`NewBoop`, {
					headers: {
						'x-adp-dur': getDur.toString(),
					},
				});
			} catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error Turso PUT: ${exception}`, {
					status: 500,
					headers: {
						'x-adp-dur': getDur.toString(),
					},
				});
			}
		} else if (request.method == 'GET') {
			var startReq = performance.now();
			const opName = url.pathname == '/storageselect' ? `GET Storage Select` : `GET`
			try {
				if (url.pathname == '/storageselect') {
					var newRandomNum = crypto.randomUUID();
					var outputGet = await client.execute({
						sql: `WITH matches AS (
 SELECT id, 
 CASE WHEN json_extract(data, '$[0][0]') LIKE '%AA%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[0][1]') LIKE '%BB%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[0][2]') LIKE '%CC%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[1][0]') LIKE '%DD%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[1][1]') LIKE '%EE%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][0]') LIKE '%GG%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%KK%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%LL%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%MM%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%NN%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%QQ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%PP%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%LL%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%QW%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%IO%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%NU%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%PU%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%ZQ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%IO%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%e3%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%HJ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%GQ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][2]') LIKE '%II%' THEN 1 ELSE 0 END as score
 FROM config
)
SELECT *, ?1 as '${newRandomNum}'  FROM matches 
WHERE score Like '43%'
limit 1;`,
						args: [newRandomNum],
					});
					var getDur = performance.now() - startReq;
					console.log(JSON.stringify(outputGet))
					/*
					if (outputGet.rows.length != 10) {
						return new Response(`Error Turso GET Storage Select: Expected 10 rows but got ${outputGet.rows.length} `, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
					if (outputGet.rows[0].length == 0) {
						return new Response(`Error Turso GET Storage Select: Did not return our input, returned empty row`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
					*/
					var newOutput = outputGet.columns.includes(newRandomNum)
					if (!newOutput) {
						return new Response(`Error Turso GET Storage Select: Did not return our input, returned ${JSON.stringify(outputGet.columns)}`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
						
				} else {
					var newRandomNum = crypto.randomUUID();
					var outputGet = await client.execute({ sql: `Select ?1`, args: [newRandomNum] });
					var getDur = performance.now() - startReq;
					if (outputGet.rows.length == 0) {
						return new Response(`Error Turso GET: Did not return our input, returned no rows`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
					if (outputGet.rows[0].length == 0) {
						return new Response(`Error Turso GET: Did not return our input, returned empty row`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
					var newOutput = outputGet.rows[0][0].toString();
					if (newOutput != newRandomNum) {
						return new Response(`Error Turso GET: Did not return our input, returned ${newOutput}`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
				}

				return new Response(``, {
					headers: {
						'x-adp-dur': getDur.toString(),
					},
				});
			} catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error Turso ${opName}: ${exception}`, {
					status: 500,
					headers: {
						'x-adp-dur': getDur.toString(),
					},
				});
			}
		}

		return new Response('Method not supported', { status: 405 });
	},
};

function buildLibsqlClient(env: Env, useSecondConfig: boolean): LibsqlClient {



	const url = useSecondConfig ? env.TURSO_URL2?.trim() : env.TURSO_URL?.trim();
	if (url === undefined) {
		throw new Error('TURSO_URL env var is not defined');
	}

	const authToken = useSecondConfig ? env.TURSO_AUTH_TOKEN2?.trim() : env.TURSO_AUTH_TOKEN?.trim();
	if (authToken == undefined) {
		throw new Error('TURSO_AUTH_TOKEN env var is not defined');
	}

	return createClient({ url, authToken });
}
