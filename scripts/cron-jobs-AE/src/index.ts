export interface Env {
  CronitorLinkToCall: string;
  SubmitLinkToCall: string;
  APIKeySubmitLink: string;

  cron: AnalyticsEngineDataset;
}

export class JobResult {
  jobName: string;
  internalJobName: string;
  runTime: Date;
  runLengthMs: number;
  runStatus: string;
  calculateRunLengthFromLastTime: boolean;

  constructor(
    jobName: string,
    internalJobName: string,
    runTime: Date,
    runLengthMs: number,
    runStatus: string,
    calculateRunLengthFromLastTime: boolean
  ) {
    this.jobName = jobName;
    this.internalJobName = internalJobName;
    this.runTime = runTime;
    this.runLengthMs = runLengthMs;
    this.runStatus = runStatus;
    this.calculateRunLengthFromLastTime = calculateRunLengthFromLastTime;
  }
}

export default {
  async scheduled(
    event: ScheduledEvent | null,
    env: Env,
    ctx: ExecutionContext
  ) {
    var location = await getCheckLocation(env);
    console.log(`We got location:` + location);
    try {
      var cronitor = await fetch(`${env.CronitorLinkToCall}?msg=${location}`);
      console.log(`Cronitor responded with status: ${cronitor.status}, and body of ${await cronitor.text()}`)
    } catch (exception) {
      console.log(exception);
      console.log("Error with calling cronitor, moving on.");
    }
    try {
      var customSubmit = await fetch(env.SubmitLinkToCall, {
        method: "POST",
        headers: {
          "content-type":"application/json",
          "worker": "cron-job",
          "user-agent": "Action-Delay-API Cron Job",
          APIKEY: env.APIKeySubmitLink,
        },
        body: JSON.stringify(
          new JobResult(
            "CRON Delay Job",
            "cron",
            new Date(),
            0,
            "Deployed",
            true
          )
        ),
      });
      console.log(`Custom Submit responded with status: ${customSubmit.status}, and body of ${await customSubmit.text()}`)

    } catch (exception) {
      console.log(exception);
      console.log("Error with calling submit link, moving on.");
    }
  },
};

export async function getCheckLocation(env: Env) {
  const res = await fetch("https://cloudflare.com/cdn-cgi/trace");
  var text = await res.text();
  const arr = text.split("\n");
  const sliver = arr
    .filter((v) => v.includes("sliver="))[0]
    .split("sliver=")[1];
  const kex = arr.filter((v) => v.includes("kex="))[0].split("kex=")[1];
  const colo = arr.filter((v) => v.includes("colo="))[0].split("colo=")[1];
  console.log(colo);
  try {
    env.cron.writeDataPoint({
      blobs: [sliver, kex, colo],
      doubles: [1],
      indexes: [colo], // Sensor ID
    });
  } catch (exception) {
    console.log(exception);
    console.log("Error with calling AE, moving on.");
  }
  return text;
}
