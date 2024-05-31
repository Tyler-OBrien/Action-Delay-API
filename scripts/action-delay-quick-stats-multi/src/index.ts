

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

const jobs = [
    {
        display: "Free DNS Propagation Delay",
      internalName: "DNS Delay Job Free",
      short: "dnsfree"
    },
    {
        display: "Paid DNS Propagation Delay",
        internalName: "DNS Delay Job",
        short: "dns",
    },
    {
        display: "Worker Deployment Delay",
        internalName: "Worker Script Delay Job",
        short: "worker",
    },
    {
        display: "Custom Rule Update Delay",
    internalName: "Custom Rule Block Delay Job",
    short: "waf"
    },
    {
        display: "Single URL Purge Lag",
        internalName: "Single URL Purge Delay Job",
        short: "purge"
    },
    {
        display: "WfP User Script Delay Job",
        internalName: "WfP User Script Delay Job",
        short: "wfp"
    },
    {
        display: "Page Rules Update Delay",
        internalName: "Page Rule Update Delay Job",
        short: "pagerule",
        realShort: "pagerules"
    },
    {
        display: "Workers CRON Delay",
        internalName: "CRON Delay Job",
        short: "cron",
        cron: true,
    },
    {
        display: "Zone Analytics Delay",
        internalName: "Zone Analytics Delay Job",
        short: "analytics"
    },
    {
        display: "Workers Analytics Delay",
        internalName: "Worker Analytics Delay Job",
        short: "workeranalytics"
    },
    {
        display: "Custom Hostnames Delay Job",
        internalName: "CF for SaaS Delay Job",
        short: "customhostnames"
    },
    {
        display: "Certificate Renewal Delay",
        internalName: "Certificate Renewal Delay Job",
        short: "cert"
    },
]

const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cloudflare Delay</title>
<style>
/* Embedded CSS */
body {
    display: flex;
    flex-direction: column;  /* Adjust the direction to column */
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    background: #f0f0f0;
    font-family: Arial, sans-serif;
    padding: 0;
}

.header-container {
    text-align: center;
    margin: 0;
    padding: 2em;
    max-width: 90vw;
    border-radius: 0.5em;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    background-color: #fff; /* Adjust color according to your need */
}

.main-header {
    font-size: 2.5em;
    font-weight: bold;
    margin-bottom: 0.5em; 
}

.sub-header-text {
    font-size: 1.2em; 
    line-height: 1.6;
    color: #555; 
    margin: 0 auto;
}
.card {
    max-width: 90vw;
    min-height: 18vh;
    background: #fff;
    padding: 2em;
    margin: 1em;
    text-align: center;
    border-radius: 0.5em;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.header {
    font-size: 2em;
    margin-bottom: 0.2em;
}
.sub-header {
    font-size: 1.5em;
    margin-bottom: 0.2em;
}
.timestamp {
    font-size: 1em;
    color: #999;
    margin-bottom: 0.5em;
}
.timeDuration, .highlightYellow, .medians {
    font-size: 1em;
    color: #999;
    margin-bottom: 0.1em;
}
.peak-period {
    margin-bottom: 0.5em;
}
.highlightGreen {
    color: #05fa0e;
}
.highlightYellow {
    color: #ffa300;
}
.highlightGreen {
    color: green;
}
.highlightRed {
    color: #fc0d03;
}
.links {
    margin-top: 0.5em;
}
#grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2vh;
    justify-content: flex-start;
    padding: 2vh;
    box-sizing: content-box;
    overflow: hidden;
}

@media screen and (min-width: 600px) { 
  #grid-container {
    grid-template-columns: repeat(2, 1fr); 
  }
}

@media screen and (min-width: 900px) {
    #grid-container {
        grid-template-columns: repeat(3, 1fr);
    }
} 

.card {
    padding: 2em;
    margin: 2em 0;
    text-align: center;
    border-radius: 0.5em;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    background: #fff;
}

a {
    color: #2e7ed1;
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: #2e7ed1;
}

a:visited {
    color: #2e7ed1;
}

a:active {
    color: #2e7ed1;
}
</style>
</head>
<body>
<div class="header-container">
<h1 class="main-header"> <a href="https://github.com/Tyler-OBrien/Action-Delay-API">Action Delay Tracker</a></h1>
<p class="sub-header-text">
    We do each action once a minute using the CF API. For example, 
    updating a DNS Record, or updating a Worker. <br> Then from 25 <a href="https://delay.cloudflare.chaika.me/v2/locations">locations</a>
    we make requests until we see the change. <br> When 
    half of those locations see the change, we consider the change propagated 
    and the job complete.  <br>
    This is not designed to be a benchmark. Results may be faster then shown. This is aimed to show/detect issues/delay. <br>
    <a href="https://delay.cloudflare.chaika.me/swagger">API Docs</a>,  <a href="https://github.com/Tyler-OBrien/Action-Delay-API">Source</a>, <a href="https://status.tylerobrien.dev/status/action-delay-api">WIP Status Page</a>
</p>
</div>
<div class="cards" id="grid-container">
${jobs.map(job => 
`<div class="card" id="card${job.short}">
<div class="header" id="header${job.short}"><a  href="https://${job.realShort ?? job.short}.cloudflare.chaika.me">${job.display}</a></div>
<div class="sub-header" id="delay${job.short}">Loading... </div><a class="pendingLbl" id="pending${job.short}"></a>
${job.cron ? `
<div class="sub-header" id="cron${job.short}">Loading... </div><a class="pendingLbl" id="cron${job.short}"></a>
` : ""}
<div class="timestamp" id="lastUpdated${job.short}"></div>

<div class="peak" id="peak${job.short}"></div>
<div class="peak-period" id="peak-period${job.short}"></div>
${!job.cron ? `
<div class="medians" id="median1${job.short}"></div>
<div class="medians" id="median2${job.short}"></div>
<div class="medians" id="median3${job.short}"></div>
` : ""}
</div>`
).join("")}
</div>
</body>
<script>
// Auto call function on load
medianTime1d = {}

var jobs = [
{
    display: "Free DNS Propagation Delay",
  internalName: "DNS Delay Job Free",
  short: "dnsfree"
},
{
    display: "Paid DNS Propagation Delay",
    internalName: "DNS Delay Job",
    short: "dns",
},
{
    display: "Worker Deployment Delay",
    internalName: "Worker Script Delay Job",
    short: "worker",
},
{
    display: "Custom Rule Update Delay",
internalName: "Custom Rule Block Delay Job",
short: "waf"
},
{
    display: "Single URL Purge Lag",
    internalName: "Single URL Purge Delay Job",
    short: "purge"
},
{
    display: "WfP User Script Delay Job",
    internalName: "WfP User Script Delay Job",
    short: "wfp"
},
{
    display: "Page Rules Update Delay",
    internalName: "Page Rule Update Delay Job",
    short: "pagerule",
    realShort: "pagerules"
},
{
    display: "Workers CRON Delay",
    internalName: "CRON Delay Job",
    short: "cron",
    cron: true
},
{
    display: "Zone Analytics Delay",
    internalName: "Zone Analytics Delay Job",
    short: "analytics"
},
{
    display: "Workers Analytics Delay",
    internalName: "Worker Analytics Delay Job",
    short: "workeranalytics"
},
{
    display: "Custom Hostnames Delay Job",
    internalName: "CF for SaaS Delay Job",
    short: "customhostnames"
},
{
    display: "Certificate Renewal Delay",
    internalName: "Certificate Renewal Delay Job",
    short: "cert"
},
]

function formatTime(ms) {

let seconds = ms / 1000;
if (seconds < 60) {
return seconds.toFixed(2) + ' second(s)';
}

let minutes = seconds / 60;
if (minutes < 60) {
return minutes.toFixed(2) + ' minute(s)';
}

let hours = minutes / 60;
return hours.toFixed(2) + ' hour(s)';
}

async function FetchCurrentInfo() {
    const currentInfoResponse = await fetch('https://delay.cloudflare.chaika.me/v2/jobs');
    const getAllJobs = await currentInfoResponse.json();
for (let job of jobs)
try
{
    var currentInfoData = getAllJobs.data.find(info => info.jobName.toUpperCase() == job.internalName.toUpperCase());

let delay = document.getElementById('delay' + job.short);
let pending = document.getElementById('pending' + job.short);
var getJobMedian = medianTime1d[job.short]
var runTimeToUse = currentInfoData.currentRunTime;
if (currentInfoData.currentRunStatus === "Deployed") {
    if (job.short === "cron") {
        let cronId = document.getElementById('cron' + job.short);
        delay.textContent = "Last Event: " + formatTime(new Date() - new Date(currentInfoData.currentRunTime)) + " ago"
        if (currentInfoData.currentRunLengthMs < 120000) {
            cronId.textContent = "Healthy";
            cronId.className = 'sub-header highlightGreen';
        }
        else {
            cronId.textContent = "Delayed";
            pending.className = 'sub-header highlightYellow';
        }
    }
    else {
    delay.textContent = formatTime(currentInfoData.currentRunLengthMs);
    }
    pending.className = '';
    pending.textContent = '';
} else if (currentInfoData.currentRunStatus === "Undeployed" && ((!getJobMedian || currentInfoData.currentRunLengthMs  > getJobMedian * 1.2) && currentInfoData.currentRunLengthMs > 5000)) {
    delay.textContent = formatTime(currentInfoData.currentRunLengthMs);
    if ((!getJobMedian || (currentInfoData.currentRunLengthMs * 3) > getJobMedian) && currentInfoData.currentRunLengthMs > 30000)
    {
        pending.textContent = 'IN PROGRESS';
        pending.className = 'highlightRed';
    }
    else {
    pending.textContent = 'IN PROGRESS';
    pending.className = 'highlightYellow';
    }
}
else if (currentInfoData.currentRunStatus == "API_Error" && currentInfoData.lastRunStatus == "API_Error") {
    delay.textContent = 'CF API Error';
    pending.textContent = 'CF API Error';
    pending.className = 'highlightRed';
}
else
{
    delay.textContent = formatTime(currentInfoData.lastRunLengthMs);
    pending.className = '';
    pending.textContent = '';
    runTimeToUse = currentInfoData.lastRunTime;
}

document.getElementById('lastUpdated' + job.short).textContent = "Last Update: " + formatTime(new Date() - new Date(runTimeToUse)) + " ago";

} catch (error) {
console.error(\`Fetch failed: \${error}\, \${error.lineNumber\}\`);
}
}

async function FetchQuickAnalytics() {
for (let job of jobs)
try {
    const quickAnalyticsResponse = await fetch('https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/' + job.short);
    const quickAnalyticsData = await quickAnalyticsResponse.json();

// Parsing quickanalytics and updating the HTML
let peakPeriod, dailyMedian, monthlyMedian, quarterlyMedian;

quickAnalyticsData.forEach((item) => {
switch (item.period) {
case "Last 1 Day":
    dailyMedian = formatTime(parseInt(item.median_run_length));
    if (item.median_run_length && (parseInt(item.median_run_length)) > 0)
        medianTime1d[job.short] = parseInt(item.median_run_length);
    break;
case "Last 30 Days":
    monthlyMedian = formatTime(parseInt(item.median_run_length));
    break;
case "Last 90 Days":
    quarterlyMedian = formatTime(parseInt(item.median_run_length));
    break;
default:
    peakPeriod = formatTime(parseInt(item.median_run_length));
    document.getElementById('peak-period' + job.short).textContent = \`From \${new Date(item.period + "Z").toLocaleTimeString()} - \${new Date(new Date(item.period + "Z").getTime() + parseInt(item.median_run_length)).toLocaleTimeString()} \`
}
})

document.getElementById('peak' + job.short).textContent = "Last 24H Peak of " + peakPeriod;
if (job.cron) continue;
document.getElementById('median1' + job.short).textContent = "1 Day Median: " + dailyMedian;
document.getElementById('median2' + job.short).textContent = "30 Days Median: " + monthlyMedian;
document.getElementById('median3' + job.short).textContent = "90 Days Median: " + quarterlyMedian;


} catch (error) {
    console.error(\`Fetch failed: \${error}\, \${error.lineNumber\}\`);
}
}

setInterval(FetchCurrentInfo, 10000); 
setInterval(FetchQuickAnalytics, 360000);

FetchCurrentInfo();
FetchQuickAnalytics();

</script>
</html>`


export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var newUrl = new URL(req.url);
		if (newUrl.pathname == "/") {
		return new Response(HTML, { headers: {"Content-Type": "text/html"}});
		}
		return new Response("There's nothing here friend", { status: 404})
	},
};
