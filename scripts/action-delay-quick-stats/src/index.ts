

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

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var newUrl = new URL(req.url);
		let display = ""
		let internalName = "";
		if (newUrl.hostname.startsWith("dnsfree")) {
			display = "Free DNS Propagation Delay";
			internalName = "DNS Delay Job Free"
		}
		else if (newUrl.hostname.startsWith("dns")) {
			display = "Paid DNS Propagation Delay";
			internalName = "DNS Delay Job";
		}
		else if (newUrl.hostname.startsWith("worker") || newUrl.hostname == '127.0.0.1') {
			display = "Worker Deployment Delay";
			internalName = "Worker Script Delay Job";
		}
		else if (newUrl.hostname.startsWith("waf")) {
			display = "Custom Rule Update Delay";
			internalName = "Custom Rule Block Delay Job";
		}
		else if (newUrl.hostname.startsWith("purge")) {
			display = "Single URL Purge Lag";
			internalName = "Single URL Purge Delay Job";
		}
        
		else if (newUrl.hostname.startsWith("wfp")) {
			display = "WfP User Script Delay Job";
			internalName = "WfP User Script Delay Job";
		}
		

		if (newUrl.pathname == "/currentinfo") {
			return fetch("https://delay.cloudflare.chaika.me/v1/quick/CurrentInfo/" + internalName)
		}
		if (newUrl.pathname == "/quickanalytics") {
			return fetch("https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/" + internalName)
		}
		else if (newUrl.pathname == "/") {
		let HTML = `
		<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${display}</title>
    <style>
        /* Embedded CSS */
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        .card {
            max-width: 90vw;
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
        #peak-period {
            margin-bottom: 0.5em;
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
    <div class="card">
        <div class="header">${display}</div>
        <div class="sub-header" id="delay">Loading...</div><a class="pendingLbl" id="pending"></a>
        <div class="timestamp" id="lastUpdated"></div>
        <div id="peak"></div>
        <div id="peak-period"></div>
        <div class="medians"></div>
        <div class="medians"></div>
        <div class="medians"></div>
		<div class="links">
		<a href="https://dns.cloudflare.chaika.me">DNS Delay (Paid)</a><br>
		<a href="https://dnsfree.cloudflare.chaika.me">DNS Delay (Free)</a><br>
		<a href="https://worker.cloudflare.chaika.me">Worker Deployment Lag</a><br>
		<a href="https://wfp.cloudflare.chaika.me">WFP User Script Deployment Lag</a><br>
		<a href="https://waf.cloudflare.chaika.me">Custom Rule Update Delay</a><br>
		<a href="https://purge.cloudflare.chaika.me">Single URL Purge Delay</a><br>
		<a href="https://all.cloudflare.chaika.me">Overview of All</a><br>
	</div>
    </div>
</body>
<script>
    // Auto call function on load

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
    const currentInfoResponse = await fetch('/currentinfo');
        const currentInfoData = await currentInfoResponse.json();

        let delay = document.getElementById('delay');
        let pending = document.getElementById('pending');
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

        document.getElementById('lastUpdated').textContent = "Last Updated: " + new Date(currentInfoData.currentRunTime).toLocaleTimeString();

}

async function FetchQuickAnalytics() {
    try {
const quickAnalyticsResponse = await fetch('/quickanalytics');
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
            document.getElementById('peak-period').textContent = \`From \${new Date(item.period + "Z").toLocaleTimeString() } - \${new Date(new Date(item.period + "Z").getTime() + parseInt(item.median_run_length)).toLocaleTimeString()} \`
    }
})

document.getElementById('peak').textContent = "Last 24H Peak of " + peakPeriod;
document.getElementsByClassName('medians')[0].textContent = "1 Day Median: " + dailyMedian;
document.getElementsByClassName('medians')[1].textContent = "30 Days Median: " + monthlyMedian;
document.getElementsByClassName('medians')[2].textContent = "90 days Median: " + quarterlyMedian;


} catch (error) {
console.error(\`Fetch failed: \${error}\`);
}
}

setInterval(FetchCurrentInfo, 30000); 
    setInterval(FetchQuickAnalytics, 60000);

    FetchCurrentInfo();
    FetchQuickAnalytics();

</script>
</html>

		`
		return new Response(HTML, { headers: {"Content-Type": "text/html"}});
		}
		return new Response("There's nothing here friend", { status: 404})
	},
};