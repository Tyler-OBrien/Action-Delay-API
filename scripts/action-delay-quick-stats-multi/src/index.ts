

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
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    background: #f0f0f0;
    font-family: Arial, sans-serif;
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
<div class="cards" id="grid-container">
${jobs.map(job => 
`<div class="card" id="card${job.short}">
<div class="header" id="header${job.short}"><a  href="https://${job.short}.cloudflare.chaika.me">${job.display}</a></div>
<div class="sub-header" id="delay${job.short}">Loading... </div><a class="pendingLbl" id="pending${job.short}"></a>
<div class="timestamp" id="lastUpdated${job.short}"></div>
<div class="peak" id="peak${job.short}"></div>
<div class="peak-period" id="peak-period${job.short}"></div>
<div class="medians" id="median1${job.short}"></div>
<div class="medians" id="median2${job.short}"></div>
<div class="medians" id="median3${job.short}"></div>
</div>`
).join("")}
</div>
</body>
<script>
// Auto call function on load


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
}
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
for (let job of jobs)
try
{
const currentInfoResponse = await fetch('/currentinfo/' + job.internalName);
const currentInfoData = await currentInfoResponse.json();

let delay = document.getElementById('delay' + job.short);
let pending = document.getElementById('pending' + job.short);
if (currentInfoData.currentRunStatus === "Deployed") {
    delay.textContent = formatTime(currentInfoData.currentRunLengthMs);
    pending.className = '';
    pending.textContent = '';
} else if (currentInfoData.currentRunStatus === "Undeployed" && currentInfoData.currentRunLengthMs > 5000) {
    delay.textContent = formatTime(currentInfoData.currentRunLengthMs);
    if (currentInfoData.currentRunLengthMs > 60000)
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
}

document.getElementById('lastUpdated' + job.short).textContent = "Last Updated: " + new Date(currentInfoData.currentRunTime).toLocaleTimeString();

} catch (error) {
console.error(\`Fetch failed: \${error}\`);
}
}

async function FetchQuickAnalytics() {
for (let job of jobs)
try {
const quickAnalyticsResponse = await fetch('/quickanalytics/' + job.internalName);
const quickAnalyticsData = await quickAnalyticsResponse.json();

// Parsing quickanalytics and updating the HTML
let peakPeriod, dailyMedian, monthlyMedian, quarterlyMedian;

quickAnalyticsData.forEach((item) => {
switch (item.period) {
case "Last 1 Day":
    dailyMedian = formatTime(parseInt(item.median_run_length));
    break;
case "Last 30 Days":
    monthlyMedian = formatTime(parseInt(item.median_run_length));
    break;
case "Last 90 Days":
    quarterlyMedian = formatTime(parseInt(item.median_run_length));
    break;
default:
    peakPeriod = formatTime(parseInt(item.median_run_length));;
    document.getElementById('peak-period' + job.short).textContent = \`From \${new Date(item.period + "Z").toLocaleTimeString()} - \${new Date(new Date(item.period + "Z").getTime() + parseInt(item.median_run_length)).toLocaleTimeString()} \`
}
})

document.getElementById('peak' + job.short).textContent = "Last 24H Peak of " + peakPeriod;
document.getElementById('median1' + job.short).textContent = "1 Day Median: " + dailyMedian;
document.getElementById('median2' + job.short).textContent = "30 Days Median: " + monthlyMedian;
document.getElementById('median3' + job.short).textContent = "90 Days Median: " + quarterlyMedian;


} catch (error) {
console.error(\`Fetch failed: \${error}\`);
}
}

setInterval(FetchCurrentInfo, 30000); 
setInterval(FetchQuickAnalytics, 60000);

FetchCurrentInfo();
FetchQuickAnalytics();

</script>
</html>`


export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var newUrl = new URL(req.url);
		if (newUrl.pathname.startsWith("/currentinfo")) {
            var getName = newUrl.pathname.replace("/currentinfo/", "").replaceAll("%20", " ");
            if (jobs.some(job => job.internalName == getName) == false) {
                return new Response(`${getName} isn't a valid job name you can use. Pls no abuse api :( )`, { status: 500})
            }
            
			return fetch("https://delay.cloudflare.chaika.me/v1/quick/CurrentInfo/" + getName )
		}
		if (newUrl.pathname.startsWith("/quickanalytics")) {

            var getName = newUrl.pathname.replace("/quickanalytics/", "").replaceAll("%20", " ");
            if (jobs.some(job => job.internalName == getName) == false) {
                return new Response(`${getName} isn't a valid job name you can use. Pls no abuse api :( )`, { status: 500})
            }
			return fetch("https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/" + getName)
		}
		else if (newUrl.pathname == "/") {
		return new Response(HTML, { headers: {"Content-Type": "text/html"}});
		}
		return new Response("There's nothing here friend", { status: 404})
	},
};