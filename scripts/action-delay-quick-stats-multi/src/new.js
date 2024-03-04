   // Auto call function on load


   var jobs = [
    {
        display: "Free DNS Propagation Delay",
      internalName: "DNS Delay Job Free",
      short: "dnsfree"
    },
    {
        display: "Paid DNS Propagation Delay",
        internalName: "DNS Delay Job Free",
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
    if (currentInfoData.currentRunStatus === "Deployed") {
        delay.textContent = formatTime(currentInfoData.currentRunLengthMs);
    } else if (currentInfoData.currentRunStatus === "Undeployed" && currentInfoData.currentRunLengthMs > 5000) {
        delay.textContent = formatTime(currentInfoData.currentRunLengthMs) + " PENDING";
        delay.className = 'highlightYellow';
    }
    else
    {
        delay.textContent = formatTime(currentInfoData.lastRunLengthMs);
    }

    document.getElementById('lastUpdated' + job.short).textContent = "Last Updated: " + new Date(currentInfoData.currentRunTime).toLocaleTimeString();
}
catch (error) {
console.error(`Fetch failed: ${error}`);
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
        document.getElementById('peak-period' + job.short).textContent = `From ${new Date(item.period).toLocaleTimeString()} - \${new Date(new Date(item.period).getTime() + parseInt(item.median_run_length)).toLocaleTimeString()} `
}
})

document.getElementById('peak' + job.short).textContent = "Last 24H Peak of " + peakPeriod;
document.getElementById('medians1' + job.short).textContent = "1 Day Median: " + dailyMedian;
document.getElementById('medians2' + job.short).textContent = "30 Days Median: " + monthlyMedian;
document.getElementById('medians3' + job.short).textContent = "90 days Median: " + quarterlyMedian;


} catch (error) {
console.error(`Fetch failed: ${error}`);
}
}

setInterval(FetchCurrentInfo, 10000); 
setInterval(FetchQuickAnalytics, 60000);

FetchCurrentInfo();
FetchQuickAnalytics();