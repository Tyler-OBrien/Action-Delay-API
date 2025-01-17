export interface Env {
	DB: D1Database;
	DBStorageSelect: D1Database;
	API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var url = new URL(request.url);
		if ((request.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
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
				var output = await env.DB.prepare(`INSERT OR REPLACE INTO Test (ID, test) VALUES (0, ?1);`).bind(tryGetBuffer).run();

				var getDur = performance.now() - startReq;
				if (output.meta.changes == 0) {
					return new Response(`Error D1 PUT: Expected there to be one change but got ${output.meta.changes}`, {
						status: 500,
						headers: {
							'x-adp-dur': getDur.toString(),
						},
					});
				}

				return new Response(`NewBoop`, {
					headers: {
						'x-adp-dur': getDur.toString(),
						'x-db-internal-dur': output.meta.duration.toString(),
					},
				});
			} catch (exception) {
				console.log(exception);
				var getDur = performance.now() - startReq;
				return new Response(`Error D1 PUT: ${exception}`, {
					status: 500,
					headers: {
						'x-adp-dur': getDur.toString(),
					},
				});
			}
		} else if (request.method == 'GET') {
			var startReq = performance.now();
			try {
				if (url.pathname == '/storageselect') {
					var newRandomNum = crypto.randomUUID();
					var outputGet = await env.DBStorageSelect.prepare(`WITH matches AS (
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
limit 1;`).bind(newRandomNum).all()
					var getDur = performance.now() - startReq;
					var newOutput = outputGet.meta.rows_read >= 2000
					if (!newOutput) {
						return new Response(`Error D1 GET Storage Select: Did not look at least 2k rows, returned ${newOutput}`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
					/*
					if (outputGet.results.length != 10) {
						return new Response(`Error D1 GET Storage Select: Returned less rows then expected, returned ${outputGet.results.length}`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
						*/
				} else {
					var newRandomNum = crypto.randomUUID();
					var outputGet = await env.DB.prepare(`Select ?1`).bind(newRandomNum).all();
					var getDur = performance.now() - startReq;
					var newOutput = outputGet.results[0]['?1'].toString();
					if (newOutput != newRandomNum) {
						return new Response(`Error D1 GET: Did not return our input, returned ${newOutput}`, {
							status: 500,
							headers: {
								'x-adp-dur': getDur.toString(),
							},
						});
					}
				}

				return new Response("", {
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
		}

		return new Response('Method not supported', { status: 405 });
	},
};
