import { BetterKV } from "flareutils";
import { Toucan } from 'toucan-js';
import { instrument, ResolveConfigFn } from '@microlabs/otel-cf-workers'
import { instrumentDO } from '@microlabs/otel-cf-workers'



const HTML = `<!DOCTYPE html>
<html>
    <head>
        <title>Workers Deployment Lag</title>
        <style>
            canvas {
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
            #undeployed {
              max-height: 100vh !important;
            }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@^3"></script>
        <script src="https://cdn.jsdelivr.net/npm/luxon@^2"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@^1"></script>    
        <script src="index.js"></script>
    </head>
    <body>
        <div>
            <canvas id="undeployed"></canvas>
        </div>
        <p>New (2023-10-01)! Based on v2 data collector, which is more accurate, and not built on the Cloudflare stack (using just C#, Clickhouse and Postgres). Old data is still available via <a href="/?v1">/?v1</a>,  /v1/stats and /v1/predicted, new is also on /v2/stats and /v2/predicted. /stats and /predicted will always point to the latest version. </p>
        <p>Yellow points/lines are pending deployments, whose final deployment times are yet unfinalized. </p>
        <p>You can access <a href="/stats">/stats</a> for API friendly stat. You can access <a href="/predicted">/predicted</a> for the predicted time in raw text. Feel free to use these APIs, instead of making your own and adding extra load. Data is all cached in KV.</p>
        <p>How? We deploy once a minute, with a specific value in the response of the deployed worker. We then use Durable Objects and Durable Object Alarms to "chase" the deployment, at first checking once per second, and then slowly falling back to slower checks to see when it is deployed.</p>
        <p>Data is pushed into Analytics Engine (these charts) and KV (the /stats /predicted endpoints).</p>
        <p>This data isn't perfect of course, only Cloudflare knows the true length of queue, but it's a good estimate. Fundamentally it seems to just be a simple queue, so in theory this should be spot on, at least for detecting the max wait time.</p>
        <p>Expect some variation though. I would say anything less then 1 minute is normal. Anything more then 5 minutes is a problem. Just based on my observation. If you have any questions, I have all 90 days of data + data from another account used for confirmation as well, so feel free to ask :)</p>
    </body>
</html>
`

const JS = `
function formatDuration(ms) {
	var seconds = (ms / 1000).toLocaleString();
	if (ms < 60000) {
		return seconds + 's';
	}
	var minutes = (ms / 60000).toLocaleString();
	if (ms < 3600000) {
		return minutes + 'min';
	}
	var hours = (ms / 3600000).toLocaleString();
	return hours + 'h';
}
const apiVersion = window.location.search.includes("v1") ? "" : "v2" 
async function loadData(deployedUrl) {
	var ctx = document.getElementById(deployedUrl).getContext('2d');

	var tryGetDataRequest = await fetch("/" + deployedUrl + apiVersion +  "?fromUI=true7");
	var tryGetUnSmoothData = await tryGetDataRequest.json();
	var chartData = tryGetUnSmoothData.data;
	if (deployedUrl == "undeployed") {
		var chartData = Object.values(
			chartData.reduce((acc, curr) => {
				if (!acc[curr.run_time] || acc[curr.run_time].workers_deploy_lag < curr.workers_deploy_lag) {
					acc[curr.run_time] = curr;
				}
				return acc;
			}, {})
		);
	}
  chartData = chartData.filter((data) => data.workers_deploy_lag > 0);
	globalThis.chartData = chartData;
	// convert to array format for Chart.js
	var data = {
		labels: chartData.map(function(item) {
			// convert timestamp to date and format it
			var date = luxon.DateTime.fromMillis(Number(item.t)).toISO();
			return date;
		}),
		datasets: [{
			label: 'Time Taken',
			backgroundColor: function(context) {
				if (context.type == "dataset") {
					return 'rgba(0,123,255,0.5)';
				}
				var deployed = globalThis.chartData[context.dataIndex].deployed;
				if (deployed == "false") {
					return 'yellow';
				}
				var value = context.dataset.data[context.dataIndex];
				return value >= 90000 ? 'red' : 'rgba(0,123,255,0.5)';
			},
			borderColor: function(context) {
				if (context.type == "dataset") {
					return 'rgba(0,123,255,0.5)';
				}
				var deployed = globalThis.chartData[context.dataIndex].deployed;
				if (deployed == "false") {
					return 'yellow';
				}
				var value = context.dataset.data[context.dataIndex];
				return value >= 90000 ? 'red' : 'rgba(0,123,255,1)';
			},
			data: chartData.map(function(item) {

				return item.workers_deploy_lag;
			}),
			fill: true,
			segment: {
				borderColor: ctx => {
					if (ctx.type == "dataset") {
						return 'rgba(0,123,255,0.5)';
					}
					var deployed = globalThis.chartData[ctx.datasetIndex].deployed;
					if (deployed == "false") {
						return 'yellow';
					}
					const value = ctx.chart.data.datasets[ctx.datasetIndex].data[ctx.p1DataIndex];
					return value >= 90000 ? 'red' : 'rgba(0,123,255,1)';
				}
			}
		}]
	};
	var myChart = new Chart(ctx, {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			title: {
				display: true,
				text: 'Workers Deployment Lag: ' + (deployedUrl == "undeployed" ? "Live" : "Completed Deployments Only")
			},
			plugins: {
				title: {
					display: true,
					text: 'Workers Deployment Lag: ' + (deployedUrl == "undeployed" ? "Live" : "Completed Deployments Only"),
					font: {
						size: 20,
					}
				},
				tooltip: {
					callbacks: {
						label: function(context) {
							var label = context.dataset.label || '';
							if (label) {
								label += ': ';
							}
							if (context.parsed.y !== null) {
								label += formatDuration(context.parsed.y);
							}
							var deployed = globalThis.chartData[context.dataIndex].deployed;
							if (deployed == "false") {
								label += " (pending deployment)";
							} else {
								label += " (deployed)";
							}
							return label;
						}
					}
				}
			},
			scales: {
				x: {
					type: 'time',
					title: {
						display: true,
						text: 'Date'
					}
				},
				y: {
					title: {
						display: true,
						text: 'Time Taken'
					},
					ticks: {
						callback: function(value, index, values) {
							return formatDuration(value);
						}
					}
				}
			}
		}
	});
	setInterval(function() {
		updateData(myChart, deployedUrl);
	}, 10000);
}
async function updateData(chart, deployedUrl) {
	var tryGetDataRequest = await fetch("/" + deployedUrl + apiVersion + "?fromUI=true7");
	var tryGetUnSmoothData = await tryGetDataRequest.json();
	let newChartData = tryGetUnSmoothData.data;
	if (deployedUrl == "undeployed") {
		newChartData = Object.values(
			newChartData.reduce((acc, curr) => {
				if (!acc[curr.run_time] || acc[curr.run_time].workers_deploy_lag < curr.workers_deploy_lag) {
					acc[curr.run_time] = curr;
				}
				return acc;
			}, {})
		);
	}
  newChartData = newChartData.filter((data) => data.workers_deploy_lag > 0);
  
  if (globalThis.chartData[globalThis.chartData.length - 1].t == newChartData[newChartData.length - 1].t && globalThis.chartData[globalThis.chartData.length - 1].workers_deploy_lag == newChartData[newChartData.length - 1].workers_deploy_lag) {
    console.log("New Data is same as old, aborting refresh.");
    return;
  }
  else {
    console.log("New Data is different, refreshing.");
  }
  
  globalThis.chartData = newChartData;


	// update the labels
	chart.data.labels = newChartData.map(function(item) {
		var date = luxon.DateTime.fromMillis(Number(item.t)).toISO();
		return date;
	});

	// update the data
	chart.data.datasets[0].data = newChartData.map(function(item) {
		return item.workers_deploy_lag;
	});

	// re-render the chart
	chart.update();
}
document.addEventListener("DOMContentLoaded", function() {
	loadData("undeployed");
});
`


export interface Env {
  DO: DurableObjectNamespace;
  APIKEY: string;
  KV: KVNamespace;
  workers_deploy_lag: AnalyticsEngineDataset;
  SENTRY_DSN: string;
  CRONAPIKEY: string;
  ACCOUNT_ID: string;
  WORKER_SCRIPT_NAME: string;
  PROXY_ENDPOINT: string;
  WORKER_URL: string;

  
	BASELIME_API_KEY: string
  SERVICE_NAME: string
}

async function GetAEData(deployed: boolean, apiKey: string, acctId: string, KV: BetterKV, ctx: ExecutionContext): Promise<string> {
  var tryGetData = await fetchUrlWithCache(`https://api.cloudflare.com/client/v4/accounts/${acctId}/analytics_engine/sql`, apiKey,
    `SELECT (intDiv(toUInt32(timestamp), 10) * 10) * 1000 AS t, double1 AS workers_deploy_lag, double2 as run_time, blob4 as deployed FROM workers_deploy_lag WHERE timestamp >= NOW() - INTERVAL '3' HOUR and index1 = '${deployed ? "" : "un"}deployed' ORDER BY t FORMAT JSON`, KV, ctx)
  return JSON.stringify(tryGetData);
}

async function GetAEDatav2(deployed: boolean, apiKey: string, specialEndpoint: string, KV: BetterKV, ctx: ExecutionContext): Promise<string> {
  var tryGetData = await fetch(specialEndpoint + "/v1/compat/CompatibleWorkerScriptDeploymentAnalytics")
  var tryGetJson = await tryGetData.json();
  return JSON.stringify({ data: tryGetJson });
}



async function GetStats(apiKey: string, KV: BetterKV, ctx: ExecutionContext) {
  var lastDeployedValue = Number.parseInt(await KV.get("deployLag") as string);
  var lastUndeployedValue = Number.parseInt(await KV.get("liveLag") as string);

  let predicted = lastDeployedValue;
  if (lastUndeployedValue > lastDeployedValue) {
    predicted = lastUndeployedValue;
  }
  return ({
    "lastDeployedMs": lastDeployedValue,
    "liveMs": lastUndeployedValue,
    "predictedMs": predicted
  });

}

async function GetStatsv2(specialEndpoint: string, apiKey: string, KV: BetterKV, ctx: ExecutionContext) {
  var getCurrentStats = await fetch(specialEndpoint + "/v1/compat/CompatibleWorkerScriptDeploymentAnalytics");
  var getCurrentStatsJson = await getCurrentStats.json();
  var lastDeployedValue = Number.parseInt(getCurrentStatsJson.filter((data: any) => data.deployed == "true").sort((a: any, b: any) => b.t - a.t)[0].workers_deploy_lag);
  var lastUndeployedValue = Number.parseInt(getCurrentStatsJson.filter((data: any) => data.deployed == "false").sort((a: any, b: any) => b.t - a.t)[0]?.workers_deploy_lag ?? lastDeployedValue.toString());
  let predicted = lastDeployedValue;
  if (lastUndeployedValue > lastDeployedValue) {
    predicted = lastUndeployedValue;
  }
  return ({
    "lastDeployedMs": lastDeployedValue,
    "liveMs": lastUndeployedValue,
    "predictedMs": predicted
  });

}

function formatDuration(ms: number): string {
  var seconds = (ms / 1000).toLocaleString();
  if (ms < 60000) {
    return seconds + 's';
  }
  var minutes = (ms / 60000).toLocaleString();
  if (ms < 3600000) {
    return minutes + 'min';
  }
  var hours = (ms / 3600000).toLocaleString();
  return hours + 'h';
}

async function fetchUrlWithCache(url: string, APIKEY: string, query: string, KV: BetterKV, ctx: ExecutionContext): Promise<any> {
  const cacheKey = `${encodeURIComponent(query)}`;
  let data = await KV.get(cacheKey, "json");

  if (!data) {
    console.log(
      `Response for request url: ${cacheKey} not present in cache. Fetching and caching request.`
    );

    var newRequest = new Request(url, {
      headers: {
        "Authorization": `Bearer ${APIKEY}`
      },
      body: query,
      method: "POST"
    })

    let response = await fetch(newRequest);

    let json = await response.json();


    ctx.waitUntil(KV.put(cacheKey, JSON.stringify(json), { expirationTtl: 60 }))

    data = json;
  } else {
    console.log(`Cache hit for: ${url}.`);
  }

  return data;
}


var handler = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const bKv = new BetterKV(env.KV, ctx.waitUntil.bind(ctx), {
      cacheSpace: "cachespace",
    });
    var newurl = new URL(request.url);
    if (newurl.pathname == "/") {
      return new Response(HTML, { status: 200, headers: { "content-type": "text/html" } });
    }
    if (newurl.pathname == "/index.js") {
      return new Response(JS, { status: 200, headers: { "content-type": "text/javascript" } });
    }
    if (newurl.pathname == "/supersecretfetchmetotriggercron" && request.headers.has("APIKEY") && request.headers.get("APIKEY") == env.CRONAPIKEY) {
      await this.scheduled(null, env, ctx);
      return new Response("ok - triggered");
    }
    if (newurl.pathname == "/forceclearsupersecret" && request.headers.has("APIKEY") && request.headers.get("APIKEY") == env.CRONAPIKEY) {
      let id = env.DO.idFromName("update-me-pls");
      const stubby = env.DO.get(id);
      var shouldDeployRequest = await stubby.fetch(`https://literallyanything/forceClear`, { cf: { cacheTtl: -1 } });
      if (shouldDeployRequest.ok == false) {
        console.error(`Something went wrong with fetch: ${shouldDeployRequest.status} ${shouldDeployRequest.statusText}, aborting.`);
        return;
      }
      return new Response("ok - triggered");
    }
    if (newurl.pathname == "/v1/stats") {
      return new Response(JSON.stringify(await GetStats(env.APIKEY, bKv, ctx)), { status: 200, headers: { "content-type": "application/json" } });
    }
    if (newurl.pathname == "/v1/predicted") {
      var stats = await GetStats(env.APIKEY, bKv, ctx);
      return new Response(formatDuration(stats.predictedMs), { status: 200, headers: { "content-type": "text/plain" } });
    }
    if (newurl.pathname == "/stats" || newurl.pathname == "/v2/stats") {
      return new Response(JSON.stringify(await GetStatsv2(env.PROXY_ENDPOINT, env.APIKEY, bKv, ctx)), { status: 200, headers: { "content-type": "application/json" } });
    }
    if (newurl.pathname == "/predicted" || newurl.pathname == "/v2/predicted") {
      var stats = await GetStatsv2(env.PROXY_ENDPOINT, env.APIKEY, bKv, ctx);
      return new Response(formatDuration(stats.predictedMs), { status: 200, headers: { "content-type": "text/plain" } });
    }
    if (newurl.pathname == "/deployed") {
      return new Response(await GetAEData(true, env.APIKEY, env.ACCOUNT_ID, bKv, ctx), { status: 200 });
    }
    if (newurl.pathname == "/undeployed") {
      return new Response(await GetAEData(false, env.APIKEY, env.ACCOUNT_ID, bKv, ctx), { status: 200 });
    }
    if (newurl.pathname == "/deployedv2") {
      return new Response(await GetAEDatav2(true, env.APIKEY, env.PROXY_ENDPOINT, bKv, ctx), { status: 200 });
    }
    if (newurl.pathname == "/undeployedv2") {
      return new Response(await GetAEDatav2(false, env.APIKEY, env.PROXY_ENDPOINT, bKv, ctx), { status: 200 });
    }
    return new Response("whoru", { status: 404 });
  },
  async scheduled(
    controller: ScheduledController | null,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log(`Hello World!`);
    let id = env.DO.idFromName("update-me-pls");
    const stubby = env.DO.get(id);
    try {
      var shouldDeployRequest = await stubby.fetch(`https://literallyanything/${Date.now()}`, { cf: { cacheTtl: -1 } });
      if (shouldDeployRequest.ok == false) {
        console.error(`Something went wrong with fetch: ${shouldDeployRequest.status} ${shouldDeployRequest.statusText}, aborting.`);
        throw new Error(`Something went wrong with fetch: ${shouldDeployRequest.status} ${shouldDeployRequest.statusText}, aborting.`);
        return;
      }
    }
    catch (exception: any) {
      console.error(exception)
      console.log("DO Stubby failed to return a response, aborting: " + exception?.message ?? "unknown error");
    }
  },
};

class UnwrappedDO implements DurableObject {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname == "/forceClear") {
      await this.state.storage.delete("deployed", { noCache: true, allowConcurrency: true })
      await this.state.storage.deleteAlarm({ allowConcurrency: true });
      return new Response("ok")
    }
    if (url.searchParams.get("getDeployed") == "true") {
      return new Response(await this.state.storage.get("deployed", { noCache: true, allowConcurrency: true }))
    }

    var getDeployed = await this.state.storage.get("deployed", { noCache: true, allowConcurrency: true }) as boolean;
    if (getDeployed == false) {
      console.log("Aborting cron, we're still waiting on a worker deployment.. Response: " + getDeployed);
      return new Response("Pending Deployment still");
    }

    let tryGetTime = Date.now().valueOf();
    // Creating new FormData instance
    let formData = new FormData();

    // Appending 'worker.js' field
    let workerJsContent = `
export default {
  async fetch(request, env, ctx) {
    return new Response('${tryGetTime}');
  },
};
`;
    let workerJsBlob = new Blob([workerJsContent], {
      type: "application/javascript+module",
    });
    formData.append("worker.js", workerJsBlob, "worker.js");

    // Appending 'metadata' field
    let metadataContent = JSON.stringify({
      compatibility_date: "2023-05-18",
      usage_model: "bundled",
      logpush: false,
      bindings: [],
      main_module: "worker.js",
    });
    let metadataBlob = new Blob([metadataContent], {
      type: "application/json",
    });
    formData.append("metadata", metadataBlob, "blob");

    var tryPutWorker = await fetchPlus(
      `https://api.cloudflare.com/client/v4/accounts/${this.env.ACCOUNT_ID}/workers/services/${this.env.WORKER_SCRIPT_NAME}/environments/production?include_subdomain_availability=true`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.env.APIKEY}`,
        },
        body: formData,
        cf: {
          cacheTtl: -1,
        }
      }
    );
    var adjustedTime = Date.now() - tryGetTime;
    console.log(tryPutWorker.ok);
    if (tryPutWorker.ok == false) {
      console.log(
        `Error updating worker code: ${tryPutWorker.status} ${tryPutWorker.statusText
        }, ${await tryPutWorker.text()}`
      );
      throw new Error("Error updating worker code");
    }
    console.log(`Worker code updated!`)

    const path = url.pathname;
    await this.state.storage.put("expectTime", tryGetTime, { noCache: true, allowConcurrency: true });
    await this.state.storage.put("adjustedTime", adjustedTime, { noCache: true, allowConcurrency: true });
    await this.state.storage.put("deployed", false, { noCache: true, allowConcurrency: true });
    //var tryGetAlarm = await this.state.storage.getAlarm();
    // if (tryGetAlarm == null) {
    console.log("Setting alarm, this is for expected time of " + tryGetTime + " and adjusted time of " + adjustedTime + ", current time is " + Date.now() + " and we're setting the alarm to be " + new Date().setMilliseconds(new Date().getMilliseconds() + 1));
    await this.state.storage.setAlarm(new Date().setSeconds(new Date().getSeconds(), new Date().getMilliseconds() + 1), { allowConcurrency: true });
    console.log(`Alarm set!`);
    //}
    return new Response("ok");
  }



  async alarm() {
    const sentry = new Toucan({
      dsn: this.env.SENTRY_DSN,
      context: this.state
    });
    try {
      console.log(`Alarm triggered, it's currently ${Date.now()}, checking if we're deployed yet`)
      console.log(`Getting KV data`)
      var getExpectedTime = await this.state.storage.get("expectTime", { noCache: true, allowConcurrency: true }) as number;
      var getAdjustedTime = (await this.state.storage.get("adjustedTime", { noCache: true, allowConcurrency: true }) ?? 0) as number;
      console.log(`Getting KV data done`)
      console.log(`Getting last update time`)
      var getLastUpdate = await fetchPlus(
        this.env.WORKER_URL + `/${getExpectedTime}`, { cf: { cacheTtl: -1 } }
      );
      if (getLastUpdate.ok == false) {
        console.error(`Something went wrong with fetch: ${getLastUpdate.status} ${getLastUpdate.statusText}, aborting.`);
        await this.state.storage.put("deployed", true, { noCache: true, allowConcurrency: true });
        return;
      }
      var getLastUpdateTimeStamp = await getLastUpdate.text();
      const deployLag = Math.round(
        (Date.now() - getExpectedTime) - getAdjustedTime
      );
      console.log(`Getting last update time done, writing to AE`);
      const lastUpdateTimestamp = Number.parseInt(getLastUpdateTimeStamp);
      this.env.workers_deploy_lag.writeDataPoint({
        blobs: [deployLag, getExpectedTime, lastUpdateTimestamp, lastUpdateTimestamp == getExpectedTime],
        doubles: [deployLag, getExpectedTime, lastUpdateTimestamp],
        indexes: ["undeployed"],
      });
      console.log(`Writing to AE done, writing to KV`)
      this.env.KV.put("liveLag", deployLag.toString())
      console.log(`Deploy lag: ${deployLag}ms`);
      if (lastUpdateTimestamp == getExpectedTime) {
        console.log("Deployed! Deleting Alarm!");
        await this.state.storage.deleteAlarm({ allowConcurrency: true });
        await this.state.storage.put("deployed", true, { noCache: true, allowConcurrency: true });
        console.log("Deployed! Deleted Alarm!");
        this.env.workers_deploy_lag.writeDataPoint({
          blobs: [deployLag, getExpectedTime, lastUpdateTimestamp],
          doubles: [deployLag, getExpectedTime, lastUpdateTimestamp],
          indexes: ["deployed"],
        });
        await this.env.KV.put("deployLag", deployLag.toString())
        return;
      }
      console.log("Not deployed yet, setting another alarm.")
      let secondsUntilNextAlarm = 0.5;
      let deployLagSeconds = deployLag / 1e3;
      if (deployLagSeconds > 15) {
        secondsUntilNextAlarm = 0.5;
      }
      if (deployLagSeconds > 30) {
        secondsUntilNextAlarm = 1;
      }
      if (deployLagSeconds > 60) {
        secondsUntilNextAlarm = 2;
      }
      if (deployLagSeconds > 120) {
        secondsUntilNextAlarm = 5;
      }
      console.log("Not deployed yet, setting another alarm. Based on lag of " + deployLagSeconds + " seconds, we're setting the next alarm to be " + secondsUntilNextAlarm + " seconds from now. Looking for: " + getExpectedTime);
      if (isNaN(deployLagSeconds) == false)
        await this.state.storage.setAlarm(new Date().setMilliseconds(new Date().getMilliseconds() + (secondsUntilNextAlarm * 1000)), { allowConcurrency: true })
      console.log(`Done setting alarm`);
    }
    catch (exception) {
      console.error(exception)
      console.log("Error in alarm :(")
      sentry.captureException(exception);
    }
  }
}



function wait(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
async function fetchPlus(url: any, options = {}, retries = 5): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      return res;
    } else if (retries > 0) {
      console.log(`Retrying ${url}... ${retries} retries left (${res.status} ${res.statusText})`);
      await wait(80);
      return fetchPlus(url, options, retries - 1);
    } else {
      // If all retries have failed, return an error response here.
      return new Response("Fetch failed after all retries", { status: 500 });
    }
  } catch (error) {
    console.error(error)
    console.error(`Error trying to fetch ${url}: ${error.message}`);
    // Handle the error and return an error response here.
    return new Response("Fetch failed due to an error", { status: 500 });
  }
}

const config: ResolveConfigFn = (env: Env, _trigger) => {
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

const DOconfig: ResolveConfigFn = (env: Env, _trigger) => {
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
		service: { name: env.SERVICE_NAME + "-do" },
	}
}
const DO = instrumentDO(UnwrappedDO, DOconfig);

export { DO }
export default instrument(handler, config)