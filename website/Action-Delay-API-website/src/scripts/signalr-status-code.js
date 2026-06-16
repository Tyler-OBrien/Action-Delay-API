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
    connStatus.classList.add("websocket-connected");
    await connection.invoke("SubscribeToType", "CloudflareDelay");
  } catch (err) {
    console.log(err);
    connStatus.innerText = "Reconnecting: Not Live";
    connStatus.classList.remove("websocket-connected");
    setTimeout(start, 5000);
  }
}

connection.onreconnecting((error) => {
  connStatus.innerText = "Reconnecting: Not Live";
  connStatus.classList.remove("websocket-connected");
});

connection.onclose(async () => {
  connStatus.innerText = "Disconnected: Not Live";
  connStatus.classList.remove("websocket-connected");
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
    recomputeSummary();
  }
});

// update dates and data from other set intervals
setInterval(async () => {
  try {
    for (let job of globalThis.jobData) {
      handleJobUpdateData(job.internalJobName);
    }
    recomputeSummary();
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
    const getIncidentsData = async () => {
      return (
        await (
          await fetch(
            "https://delay.cloudflare.chaika.me/v2/incidents/type/CloudflareDelay"
          )
        ).json()
      ).data;
    };

    globalThis.incidents = await getIncidentsData();
  } catch (exception) {
    console.error(exception);
    console.log(
      `Error in job analytics refresh, are you interwebular connected?`
    );
  }
}, 30_000);

async function handleJobUpdateData(internalJobNameUpdate) {
  var getCurrentData = globalThis.jobData.find(
    (job) => job.internalJobName == internalJobNameUpdate
  );

  // var getContainingGroup = globalThis.groups.
  if (!getCurrentData) {
    console.log(
      `Couldn't get current data for ${internalJobNameUpdate}, aborting?`
    );
    return;
  }

  var getGrp = globalThis.config.groups.find(grp => grp.items.find(item => item.jobName == internalJobNameUpdate));
  if (!getGrp) {
    /* if not in a group, probably not one we care about */
    return;
  }

  var item = getItemStatus(internalJobNameUpdate);
  var getRunLengthElement = document.getElementById(`item-${internalJobNameUpdate}-runLength`);
  if (getRunLengthElement) {
    getRunLengthElement.innerText = runLengthDisplayFormat(internalJobNameUpdate, item.length)


    var getTimeElement = document.getElementById(`item-${internalJobNameUpdate}-time`);
    getTimeElement.innerText = formatTime(item.time);

    var getColorElement = document.getElementById(`item-${internalJobNameUpdate}-color`);
    getColorElement.className = `w-3 h-3 rounded-full mr-2 ${item.color}`;

    var getStatusElement = document.getElementById(`item-${internalJobNameUpdate}-status`);
    getStatusElement.innerText = item.status;
  }
  else {
    console.log(`tried to get item-${internalJobNameUpdate}-runLength, but couldn't get...`)
  }


  if (getGrp) {
    refreshIncidentsDisplay(getGrp, internalJobNameUpdate)

    var groupStatus = getGroupStatus(getGrp.items);
    var getColorGrpElement = document.getElementById(`grp-${getGrp.name}-color`);
    getColorGrpElement.className = `w-3 h-3 rounded-full mr-2 ${groupStatus.color}`;

    var getStatusGrpElement = document.getElementById(`grp-${getGrp.name}-status`);
    getStatusGrpElement.innerText = groupStatus.status;
  }

}

// Recompute the overall-status banner (headline, dot, count chips) from the
// data the script already maintains on globalThis — no extra network calls.
function recomputeSummary() {
  try {
    if (!globalThis.config || !globalThis.jobData) return;
    const counts = { operational: 0, delayed: 0, degraded: 0, apiDown: 0 };
    for (const group of globalThis.config.groups) {
      for (const item of group.items) {
        const s = getItemStatus(item.jobName).status;
        if (s === "API Down") counts.apiDown++;
        else if (s === "Degraded") counts.degraded++;
        else if (s === "Delayed") counts.delayed++;
        else if (s === "Normal") counts.operational++;
      }
    }

    let dot = "bg-green-500";
    let headline = "All Cloudflare Systems Normal";
    if (counts.apiDown > 0) {
      dot = "bg-red-500";
      headline = `${counts.apiDown} Service${counts.apiDown > 1 ? "s" : ""} Reporting API Errors`;
    } else if (counts.degraded > 0) {
      dot = "bg-amber-500";
      headline = `${counts.degraded} Service${counts.degraded > 1 ? "s" : ""} Degraded`;
    } else if (counts.delayed > 0) {
      dot = "bg-amber-500";
      headline = `${counts.delayed} Service${counts.delayed > 1 ? "s" : ""} Delayed`;
    }

    const headlineEl = document.getElementById("overall-status-headline");
    if (headlineEl) headlineEl.innerText = headline;
    const dotEl = document.getElementById("overall-status-dot");
    if (dotEl) dotEl.className = `w-3.5 h-3.5 rounded-full flex-none ${dot}`;

    setChip("summary-count-operational", counts.operational, "Operational");
    setChip("summary-count-delayed", counts.delayed, "Delayed");
    setChip("summary-count-degraded", counts.degraded, "Degraded");
    setChip("summary-count-apidown", counts.apiDown, "API Down");
  } catch (exception) {
    console.error(exception);
    console.log(`Error recomputing summary`);
  }
}

function setChip(id, count, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("is-zero", count === 0);
  el.innerHTML = `<span class="chip-dot"></span>${count} ${label}`;
}

// Function to refresh incidents display
function refreshIncidentsDisplay(group, internalJobNameUpdate) {
  // Get the container div for incidents
  const incidentsContainer = document.getElementById(`item-${group.name}-incidents`);
  // Status-dashboard rows no longer expand (they link to the job page), so the
  // per-job incident containers are gone — nothing to refresh.
  if (!incidentsContainer) return;

  // Clear the current content
  incidentsContainer.innerHTML = '';

  // Filter incidents that match the current job name
  const filteredIncidents = globalThis.incidents.filter(inc => inc.target === internalJobNameUpdate);

  // Create and append incident elements
  filteredIncidents.forEach(incident => {
    // Create main incident container
    const incidentDiv = document.createElement('div');
    incidentDiv.className = 'incident-box';

    // Create header with incident status and start time
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between';

    const statusSpan = document.createElement('span');
    statusSpan.className = 'font-semibold';
    statusSpan.textContent = 'Active Incident';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'text-sm incident-muted';
    timeSpan.textContent = `Started: ${new Date(incident.startedAt).toLocaleString()}`;

    headerDiv.appendChild(statusSpan);
    headerDiv.appendChild(timeSpan);

    // Create content with current value and threshold
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mt-2 text-sm';

    const currentValueLabel = document.createElement('span');
    currentValueLabel.className = 'font-medium';
    currentValueLabel.textContent = 'Current Value:';

    const thresholdLabel = document.createElement('span');
    thresholdLabel.className = 'font-medium';
    thresholdLabel.textContent = 'Threshold:';

    // Assemble the content div with text nodes for proper spacing
    contentDiv.appendChild(currentValueLabel);
    contentDiv.appendChild(document.createTextNode(' '));
    contentDiv.appendChild(document.createTextNode(runLengthDisplayFormat(internalJobNameUpdate, incident.currentValue)));
    contentDiv.appendChild(document.createTextNode(' / '));
    contentDiv.appendChild(thresholdLabel);
    contentDiv.appendChild(document.createTextNode(' '));
    contentDiv.appendChild(document.createTextNode(runLengthDisplayFormat(internalJobNameUpdate, incident.thresholdValue)));

    // Assemble the entire incident div
    incidentDiv.appendChild(headerDiv);
    incidentDiv.appendChild(contentDiv);

    // Add to container
    incidentsContainer.appendChild(incidentDiv);
  });
}

function getGroupStatus(groupItems) {
  const hasIssues = groupItems.some(item => {
    const job = globalThis.jobData.find(j => j.internalJobName === item.jobName);
    if (!job) return false;

    const incident = globalThis.incidents.find(inc => inc.target === item.jobName && inc.active);
    if (incident) return true;

    if (job.predictedRunStatus === 'API_Error' || job.type === 'delayed') {
      return true;
    }

    return false;
  });

  return hasIssues ?
    { status: 'Partially Degraded', color: 'bg-yellow-500' } :
    { status: 'Normal', color: 'bg-green-500' };
}

function getItemStatus(jobName) {
  const job = globalThis.jobData.find(j => j.internalJobName === jobName);
  if (!job) return { status: 'Unknown', color: 'bg-gray-500', time: null };

  const incident = globalThis.incidents.find(inc => inc.target === jobName && inc.active);

  let time = job.currentRunTime;
  let length = job.currentRunLengthMs;
  let runStatus = job.currentRunStatus;




  if (job.currentRunStatus === "Deployed") {
    time = job.currentRunTime;
    length = job.currentRunLengthMs;
    runStatus = job.currentRunStatus;
  }
  else if (job?.currentRunStatus === "Undeployed" && job.currentRunLengthMs > 5000) {
    time = job.currentRunTime;
    length = job.currentRunLengthMs;
    runStatus = job.currentRunStatus;
  }
  else {
    time = job.lastRunTime;
    length = job.lastRunLengthMs;
    runStatus = job.lastRunStatus;
  }

  if (incident) {
    return {
      status: 'Degraded',
      color: 'bg-yellow-500',
      time: time,
      length: length,
      runStatus: runStatus,
    };
  }

  if (job.predictedRunStatus === 'API_Error') {
    return {
      status: 'API Down',
      color: 'bg-red-500',
      time: time,
      length: length,
      runStatus: runStatus,
    };
  }

  if (job.type === 'delayed') {
    return {
      status: 'Delayed',
      color: 'bg-orange-500',
      time: time,
      length: length,
      runStatus: runStatus,
    };
  }

  return {
    status: 'Normal',
    color: 'bg-green-500',
    time: time,
    length: length,
    runStatus: runStatus,
  };
}

function runLengthDisplayFormat(jobName, ms) {

  if (jobName == "cron") {
    if (ms) ms -= 60_000;
  }

  if (ms == undefined) return "";

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
function formatTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

start();
recomputeSummary();
  try {

    // silly hack to go from UTC times to local...
    for (const job of globalThis.jobData) {
      var internalJobNameUpdate = job.internalJobName;
      let item = getItemStatus(internalJobNameUpdate);
      let getTimeElement = document.getElementById(`item-${internalJobNameUpdate}-time`);
      if (getTimeElement) {
        getTimeElement.innerText = formatTime(item.time);
      }
    }
  }
  catch (exception) {
    console.error(exception)
    console.log(`Error forcing times to local on load`)
  }