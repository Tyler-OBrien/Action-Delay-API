import regions from "./routing.json";
import { instrument, ResolveConfigFn } from '@microlabs/otel-cf-workers'

export interface Env {
	KV: KVNamespace;
	API_KEY: string;

	BASELIME_API_KEY: string
	SERVICE_NAME: string
}

class GetRegionResult {

	constructor(region: string, routing: string) {
		this.region = region;
		this.routing = routing;
	}
	region: string
	routing: string;
}


const SUPPORTED_REGIONS = ['enam', 'wnam', 'weur', 'eeur', 'apac']

const handler = {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		if ((req.headers.get('apikey') == env.API_KEY) == false) {
			return new Response('Bad Human', { status: 403 });
		}
		if (req.method != "GET" && req.method != "PUT") {
			return new Response("Method Not Allowed, Bad Human.", {
				status: 405,
			});
		}
		var isUncachableOp = req.method == "PUT";

		const url = new URL(req.url);

		const key = url.pathname.slice(1);
		let getBucketLocation: GetRegionResult | null = null;
		if (url.searchParams.has("region")) {
			let getRegionOverride = url.searchParams.get("region");
			if (getRegionOverride && SUPPORTED_REGIONS.includes(getRegionOverride))
				getBucketLocation = new GetRegionResult(getRegionOverride, "override");
		}
		if (req.headers.has("region")) {
			let getRegionOverride = req.headers.get("region");
			if (getRegionOverride && SUPPORTED_REGIONS.includes(getRegionOverride))
				getBucketLocation = new GetRegionResult(getRegionOverride, "override");
		}
		if (getBucketLocation == null)
			getBucketLocation = getRegion(req.cf?.colo, req.cf?.continent);


		const isCachingEnabled = url.searchParams.has("cache") && !isUncachableOp;
		const cache = caches.default;
		var cacheDur = -1;

		console.log(`r${getBucketLocation.region},rr:${getBucketLocation.routing},c${isCachingEnabled},k${key}`)
		if (isCachingEnabled) {
			try {
				var cacheStart = performance.now();
				var getCacheMatch = await cache.match(req);
				cacheDur = performance.now() - cacheStart;
				if (getCacheMatch) {
					var newHeaders = new Headers(getCacheMatch.headers);
					newHeaders.set("routing", "cache");
					newHeaders.set("x-cache-dur", cacheDur.toString());
					return new Response(getCacheMatch.body, { headers: newHeaders });
				}
			}
			catch (exception) {
				console.log(exception);
				return new Response(`Error Cache Match: ${exception}`, { status: 500 });
			}
		}

		if (req.method == "PUT") {
			try {
				var putStart = performance.now()
				const putResult = await ((env[getBucketLocation.region] as R2Bucket).put(key, req.body));
				var putEnd = performance.now() - putStart;
				if (!putResult) {
					return new Response('Failure Uploading', {
						status: 500, headers: {
							"region": getBucketLocation.region,
							"routing": getBucketLocation.routing,
							"x-put-dur": putEnd.toString(),
						}
					});
				}
				return new Response(null, {
					status: 200, headers: {
						"region": getBucketLocation.region,
						"routing": getBucketLocation.routing,
						"x-put-dur": putEnd.toString(),
					}
				})
			}
			catch (exception) {
				console.log(exception);
				return new Response(`Error R2 PUT: ${exception}`, { status: 500 });
			}
		}
		var getDur = -1;
		var object: R2ObjectBody | null = null;
		try {
			var startGet = performance.now()
			object = await ((env[getBucketLocation.region] as R2Bucket).get(key));
			getDur = performance.now() - startGet;
		}
		catch (exception) {
			console.log(exception);
			return new Response(`Error R2 GET: ${exception}`, { status: 500 });
		}


		if (object === null) {
			var newResp = new Response('Object Not Found', {
				status: 404, headers: {
					"region": getBucketLocation.region,
					"routing": getBucketLocation.routing
				}
			});
			if (isCachingEnabled)
				newResp.headers.set('x-cache-dur', cacheDur.toString());
			newResp.headers.set('x-get-dur', getDur.toString());
			return newResp;
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		headers.set('region', getBucketLocation.region)
		headers.set('routing', getBucketLocation.routing)
		if (isCachingEnabled)
			headers.set('x-cache-dur', cacheDur.toString());
		headers.set('x-get-dur', getDur.toString());


		if (isCachingEnabled) {
			headers.set("CF-Cache-Status", "MISS");
			headers.set("Cache-Control", object.httpMetadata?.cacheControl ?? "public, max-age=31557600")
		}
		else {
			headers.set("CF-Cache-Status", "DYNAMIC");
		}

		var newResp = new Response(object.body, {
			headers,
		});
		if (isCachingEnabled)
			ctx.waitUntil(cache.put(req, newResp.clone()));
		return newResp;
	},

};

const getRegion = function (iata: regions, continent: string | undefined): GetRegionResult {


	const tryGetRegion = regions?.results[iata];
	if (tryGetRegion) {
		if (SUPPORTED_REGIONS.includes(tryGetRegion))
			return new GetRegionResult(tryGetRegion, "map");
		else
			console.log(`Fallback, we tried to use ${tryGetRegion}, but it wasn't part of SUPPORTED_REGIONS, for ${iata}.`)
		//  This code was designed so you have buckets in all locations. Kind of hard to make a smart fallback as well based on new regions we don't know the name of yet.
		//  The continent switching below should be enough, and would  also have to be updated  for new locations
	}

	console.log(`Fallback, couldn't find anything for ${iata}`)

	if (!continent)
		return new GetRegionResult(SUPPORTED_REGIONS[0], "fallback-global"); // simple fallback

	// ok we're falling back. Let's use continent and flatten it:
	// This isn't perfect, and is partially based on what I've noticed. I think East  US / West EU is a better fallback for those. For Africa going to  WEUR and South America going to ENAM, this matches DO routing behavior.
	switch (continent) {
		case "NA":
		case "T1":  // Tor is slow as heck anyway, they won't notice. This is the easiest for a fallback anyway.
			return new GetRegionResult("enam", "fallback-continent");
		case "AF":
		case "EU":
			return new GetRegionResult("weur", "fallback-continent");
		case "SA":
		case "AN":
			return new GetRegionResult("enam", "fallback-continent");
		case "OC":
		case "AS":
			return new GetRegionResult("apac", "fallback-continent");
	}

	return new GetRegionResult(SUPPORTED_REGIONS[0], "fallback-global"); // simple fallback
}

const config: ResolveConfigFn = (env: Env, _trigger: any) => {
	// if null, we're not going to export any..
	if (!env.BASELIME_API_KEY) {
		const headSamplerConfig = {
			acceptRemote: false, //Whether to accept incoming trace contexts
			ratio: 0.0 //number between 0 and 1 that represents the ratio of requests to sample. 0 is none and 1 is all requests.
		}
		return {
			sampling: {
				headSampler: headSamplerConfig
			},
			exporter: {},
			service: {}
		}
	}
	return {
		exporter: {
			url: 'https://otel.baselime.io/v1',
			headers: { 'x-api-key': env.BASELIME_API_KEY },
		},
		service: { name: env.SERVICE_NAME },
	}
}



export default instrument(handler, config)