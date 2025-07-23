const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://delay.cloudflare.chaika.me/v2/jobs/signalr", {
    transport: signalR.HttpTransportType.WebSockets,
    skipNegotiation: true,
  })
  .configureLogging(signalR.LogLevel.Information)
  .withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol())
  .build();

const connStatus = document.getElementById("websocket-conn-status");

async function start() {
  try {
    await connection.start();
    console.log("SignalR Connected " + connection.state);
    console.log(connection);
    connStatus.innerText = "Connected: Live Updates";
    connStatus.classList = ["websocket-connected"];
    await connection.invoke("SubscribeToType", "CloudflareDelay");
  } catch (err) {
    console.log(err);
    connStatus.innerText = "Reconnecting: Not Live";
    setTimeout(start, 5000);
  }
}

connection.onreconnecting((error) => {
  connStatus.innerText = "Reconnecting: Not Live";
  connStatus.classList = [];
});

connection.onclose(async () => {
  connStatus.innerText = "Disconnected: Not Live";
  connStatus.classList = [];
  await start();
});

connection.on("ReceiveJobUpdate", (subject, data) => {
  connStatus.innerText = `Connected: Live Updates - Last Update: ${new Date().toLocaleTimeString()}`;

  var getCurrentData = globalThis.jobData.find(
    (job) => job.internalJobName == data.JobName
  );
  if (getCurrentData) {
    // new state is now old!
    if (data.Status == "Pending") {
      getCurrentData.lastRunLengthMs = getCurrentData.currentRunLengthMs;
      getCurrentData.lastRunStatus = getCurrentData.currentRunStatus;
      getCurrentData.lastRunTime = getCurrentData.currentRunTime;
    }
    getCurrentData.currentRunLengthMs = data.RunLength;
    getCurrentData.currentRunStatus = data.Status;
    getCurrentData.currentRunTime = new Date(new Date().getTime());
    handleJobUpdateData(getCurrentData.internalJobName);
  }
});

// update dates and data from other set intervals
setInterval(async () => {
  try {
    for (let job of globalThis.jobData) {
      handleJobUpdateData(job.internalJobName);
    }
  } catch (exception) {
    console.error(exception);
    console.log(`Error in refresh data`);
  }
}, 5_000);

// job data force!
setInterval(async () => {
  try {
    const getJobs = await (
      await fetch(
        "https://delay.cloudflare.chaika.me/v2/jobs/type/CloudflareDelay"
      )
    ).json();
    for (const newJobData of getJobs.data) {
      var tryGetOldJob = globalThis.jobData.find(
        (job) => job.internalJobName == newJobData.internalJobName
      );
      if (tryGetOldJob) {
        if (
          new Date(tryGetOldJob.currentRunTime) >
          new Date(newJobData.currentRunTime)
        )
          newJobData.currentRunTime = tryGetOldJob.currentRunTime; // we abuse this for Last Update a bit, when technically it's just "Last Job Start Date", and runTime + runLength still misses API/Pending time, so we need to scuff this a bit to prevent weirdness with time going backwards, all in the name of UI
      }
    }
    globalThis.jobData = getJobs.data.filter(
      (job) => job.internalJobName != "workertesting"
    );
  } catch (exception) {
    console.error(exception);
    console.log(`Error in job refresh, are you interwebular connected?`);
  }
}, 30_000);

// analytics!!
setInterval(async () => {
  try {
    const getAnalytics = await (
      await fetch(
        "https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/type/CloudflareDelay"
      )
    ).json();
    globalThis.jobStats = getAnalytics;
  } catch (exception) {
    console.error(exception);
    console.log(
      `Error in job analytics refresh, are you interwebular connected?`
    );
  }
}, 120_000);

async function handleJobUpdateData(internalJobNameUpdate) {
  var getCurrentData = globalThis.jobData.find(
    (job) => job.internalJobName == internalJobNameUpdate
  );
  var tryGetAnalytics = globalThis.jobStats.filter((job) => job.job_name);
  let lastUpdatedTxt = "";
  let delayTxt = "";
  let delayTxtUnit = "";
  if (!getCurrentData) {
    console.log(
      `Couldn't get current data for ${internalJobNameUpdate}, aborting?`
    );
    return;
  }
  let pending = document.getElementById(
    "pending" + getCurrentData.internalJobName
  );

  const job = getCurrentData;

  const type = getCurrentData.jobType;

  function formatTime(ms) {
    if (ms == undefined) return "";

    let seconds = ms / 1000;
    if (seconds < 60) {
      return seconds.toFixed(2) + " second(s)";
    }

    let minutes = seconds / 60;
    if (minutes < 60) {
      return minutes.toFixed(2) + " minute(s)";
    }

    let hours = minutes / 60;
    return hours.toFixed(2) + " hour(s)";
  }
  function formatTimeReturnUnit(ms) {
    if (ms == undefined) return ["", ""];

    let seconds = ms / 1000;
    if (seconds < 60) {
      return [seconds.toFixed(2), `second(s)`];
    }

    let minutes = seconds / 60;
    if (minutes < 60) {
      return [minutes.toFixed(2), `minute(s)`];
    }

    let hours = minutes / 60;

    return [hours.toFixed(2), `hour(s)`];
  }

  // Parsing quickanalytics and updating the HTML
  let peakPeriod,
    dailyMedian,
    getJobMedian,
    monthlyMedian,
    peakPeriodTxt,
    quarterlyMedian;

  let quickAnalyticsData = tryGetAnalytics;

  quickAnalyticsData?.forEach((item) => {
    switch (item.period) {
      case "Last 1 Day":
        dailyMedian = formatTime(parseInt(item.median_run_length));
        if (item.median_run_length && parseInt(item.median_run_length) > 0)
          getJobMedian = parseInt(item.median_run_length);
        break;
      case "Last 30 Days":
        monthlyMedian = formatTime(parseInt(item.median_run_length));
        break;
      case "Last 90 Days":
        quarterlyMedian = formatTime(parseInt(item.median_run_length));
        break;
      default:
        peakPeriod = formatTime(parseInt(item.median_run_length));
        peakPeriodTxt = `From ${new Date(
          item.period + "Z"
        ).toLocaleTimeString()} - ${new Date(
          new Date(item.period + "Z").getTime() +
            parseInt(item.median_run_length)
        ).toLocaleTimeString()}`;
    }
  });

  var runTimeToUse = job.currentRunTime;
  var runLengthToUse = job.currentRunLengthMs;

  if (job.currentRunStatus === "Deployed") {
    if (job.internalJobName === "cron") {
      delayTxtUnit =
        "Last Event: " +
        formatTime(new Date() - new Date(job.currentRunTime)) +
        " ago";
      /*
        if (job.currentRunLengthMs < 120000) {
            cronId.textContent = "Healthy";
            cronId.className =  cronId.className.replaceAll("highlightYellow", "") + 'highlightGreen';
        }
        else {
            cronId.textContent = "Delayed";
            pending.className =  cronId.className.replaceAll("highlightGreen", "") + 'sub-header highlightYellow';
        }
		*/
    } else {
      [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
    }
    pending.className = "text-center mb-2 h-4";
    pending.textContent = "";
  } else if (
    job.currentRunStatus === "Undeployed" &&
    (!getJobMedian || job.currentRunLengthMs > getJobMedian * 1.2) &&
    job.currentRunLengthMs > 5000
  ) {
    [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
    if (
      (!getJobMedian || job.currentRunLengthMs * 3 > getJobMedian) &&
      job.currentRunLengthMs > 30000
    ) {
      pending.textContent = "IN PROGRESS";
      pending.className = "highlightRed  text-center mb-2 h-4";
    } else {
      pending.textContent = "IN PROGRESS";
      pending.className = "highlightYellow  text-center mb-2 h-4";
    }
  } else if (
    job.currentRunStatus == "API_Error" &&
    job.lastRunStatus == "API_Error"
  ) {
    delayTxt = "CF API Error";
    delayTxtUnit = "";
    pending.textContent = "CF API Error";
    pending.className = "highlightRed  text-center mb-2 h-4";
  } else {
    [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.lastRunLengthMs);
    pending.className = "text-center mb-2 h-4";
    pending.textContent = "";
    runTimeToUse = job.lastRunTime;
    runLengthToUse = job.lastRunLengthMs;
  }

  let noLastUpdate = false;

  lastUpdatedTxt =
    formatTime(new Date() - new Date(new Date(runTimeToUse).getTime())) +
    " ago";
  if (job.internalJobName === "cron") {
    noLastUpdate = true;
  }
  if (
    pending.textContent == "" &&
    (job.currentRunStatus == "Pending" || job.currentRunStatus == "Undeployed")
  ) {
    if (job.currentRunStatus == "Pending") pending.textContent = "Pending...";
    else pending.textContent = "Running...";
    pending.classList = "text-center mb-2 h-4";
  }

  if (noLastUpdate == false) {
    document.getElementById(
      `lastUpdate${job.internalJobName}`
    ).innerText = `Last Update: ${lastUpdatedTxt}`;
  }

  document.getElementById(
    `delayNumber${job.internalJobName}`
  ).innerText = `${delayTxt}`;
  document.getElementById(
    `delayUnit${job.internalJobName}`
  ).innerText = `${delayTxtUnit}`;
}

start();
