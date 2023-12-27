using Action_Deplay_API_Worker.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Worker.Models.API.Request.Jobs;
using Action_Delay_API_Worker.Models.API.Response.Jobs;
using Action_Delay_API_Worker.Models.Services;
using Action_Deplay_API_Worker.Models.Services;
using System.Net;
using DnsClient;

namespace Action_Delay_API_Worker.Services
{
    public class JobService
    {
        private readonly ILogger _logger;
        private readonly IHttpService _httpService;
        private readonly IDnsService _dnsService;

        private List<InMemoryJob> Jobs { get; set; } = new List<InMemoryJob>();

        public JobService(ILogger<JobService> logger, IHttpService httpService, IDnsService dnsService )
        {
            _logger = logger;
            _httpService = httpService;
            _dnsService = dnsService;
        }


        public JobStatusRequestResponse StatusJob(JobStatusRequest jobStatus)
        {
            var tryFindJob = Jobs.FirstOrDefault(job => job.JobName == jobStatus.JobName);
            if (tryFindJob == null)
            {
                return new JobStatusRequestResponse()
                {
                    Failed = true,
                    Info = $"Cannot find Job with Name {jobStatus.JobName}"
                };
            }


            double averageLatency = 0;
            if (tryFindJob.ResponseTimes.Any(time => time > 0))
                averageLatency = tryFindJob.ResponseTimes.Where(time => time > 0).Average();

            return new JobStatusRequestResponse()
            {
                LastCheckUtc = tryFindJob.LastCheckUtc,
                Complete = tryFindJob.Complete,
                Failed = tryFindJob.Failed,
                Info = tryFindJob.Info,
                AverageResponseLatency = Math.Round(averageLatency, 3)
            };
        }

        public JobEndRequestResponse EndJob(JobEndRequest jobEnd)
        {
            var tryFindJob = Jobs.FirstOrDefault(job => job.JobName == jobEnd.JobName);
            if (tryFindJob == null)
            {
                return new JobEndRequestResponse()
                {
                    Success = true,
                    Info = $"Cannot find Job with Name {jobEnd.JobName}"
                };
            }

            tryFindJob.Cancelled = true;
            Jobs.Remove(tryFindJob);
            return new JobEndRequestResponse()
            {
                Success = true
            };

        }

        public JobStartRequestResponse StartJob(JobStartRequest jobStart)
        {
            string info = "";
            var tryFindJob = Jobs.FirstOrDefault(job => job.JobName == jobStart.JobName);

            if (jobStart.StartUtc > DateTime.UtcNow.AddMinutes(2))
            {
                return new JobStartRequestResponse()
                {
                    Success = false,
                    Info = "Job Start cannot be more then 2 minutes into the future."
                };
            }
            else if (jobStart.StartUtc < DateTime.UtcNow)
            {
                return new JobStartRequestResponse()
                {
                    Success = false,
                    Info = "Job Start cannot be in the past"
                };
            }

            if (tryFindJob != null)
            {
                Jobs.Remove(tryFindJob);
                if (tryFindJob is { Complete: false, Failed: false })
                {
                    _logger.LogWarning(
                        $"Warning: Killing current job for {jobStart.JobName}, old was scheduled for {tryFindJob.JobDetails.StartUtc}");
                    info =
                        $"Warning: Killing current job for {jobStart.JobName}, old was scheduled for {tryFindJob.JobDetails.StartUtc}";
                }
            }

       

            Jobs.Add(new InMemoryJob()
            {
                JobDetails = jobStart,
                JobName = jobStart.JobName
            });
            return new JobStartRequestResponse()
            {
                Success = true,
                Info = info
            };
        }


        public async Task StartJobLoop(CancellationToken token)
        {
            while (token.IsCancellationRequested == false)
            {
                var currentJobs = Jobs.ToList();
                foreach (var job in currentJobs)
                {
                    
                    if (job.RunningTask == null && DateTime.UtcNow > job.JobDetails.StartUtc)
                    {
                        job.RunningTask = RunJob(job);
                    }
                }

 
                // Delay before checking the jobs again
                await Task.Delay(TimeSpan.FromMilliseconds(100));
            }
        }

        private async Task RunJob(InMemoryJob job)
        {
            DateTime utcStart = DateTime.UtcNow;
            while (true)
            {
                if (job.JobDetails.JobType == JobType.HTTP)
                {
                    await RunHttpJob(job);
                }
                else if (job.JobDetails.JobType == JobType.DNS)
                {
                    await RunDNSJob(job);
                }
                job.LastCheckUtc = DateTime.UtcNow;
                if (job.Failed)
                {
                    _logger.LogInformation($"Job {job.JobName} failed. Info: {job.Info}");
                    job.Complete = true;
                    return;
                }

                job.Failed = job.JobDetails.Validators.Any(validator =>
                    validator.ErrorIfTrue is not null and true && validator.Result);
                if (job.Failed)
                {
                    _logger.LogInformation($"Job {job.JobName} failed due to validator failing.");
                    job.Complete = true;
                    return;
                }
                job.Complete = job.JobDetails.Validators.All(validator =>
                    validator.ErrorIfTrue is null or false && validator.Result);
                if (job.Complete)
                {
                    _logger.LogInformation($"Job {job.JobName} success.");
                    return;
                }

                // Use a backoff strategy for the delay between retries
                var delay = CalculateBackoff((DateTime.UtcNow - utcStart).TotalSeconds, job);
                await Task.Delay(delay);

                if (job.Cancelled)
                {
                    _logger.LogInformation($"Job {job.JobName} cancelled.");
                    return;
                }
            }
        }

        public virtual TimeSpan CalculateBackoff(double totalWaitTimeInSeconds, InMemoryJob job)
        {
            double secondsUntilNextAlarm = 0.1;
            if (job.JobDetails.FallBackSchedule != null)
            {
                foreach (var kvp in job.JobDetails.FallBackSchedule.OrderByDescending(o => o.Key))
                {
                    if (kvp.Key < totalWaitTimeInSeconds)
                    {
                        secondsUntilNextAlarm = kvp.Value;
                        break;
                    }
                }
            }

            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }

        private async Task RunDNSJob(InMemoryJob job)
        {
            var sendDNSRequest = await _dnsService.PerformDnsLookupAsync(job.JobDetails.DnsRequest!);

            if (sendDNSRequest.ResponseTimeMs.HasValue)
                job.ResponseTimes.Add(sendDNSRequest.ResponseTimeMs.Value);

            if (sendDNSRequest.ResponseCode == DnsHeaderResponseCode.ServerFailure.ToString())
            {
                job.Failed = true;
                job.Info = sendDNSRequest.Info;
                return;
            }

            foreach (var validator in job.JobDetails.Validators)
            {
                if (validator.ValidatorType == ValidatorType.Content)
                {
                    foreach (var answer in sendDNSRequest.Answers)
                    {
                        if (answer.Value.Equals(validator.Value, StringComparison.OrdinalIgnoreCase))
                        {
                            validator.Result = true;
                        }
                        else
                        {
                            validator.Result = false;

                        }
                    }
                }
                else if (validator.ValidatorType == ValidatorType.ResponseCode)
                {
                    if (sendDNSRequest.ResponseCode == validator.Value)
                    {
                        validator.Result = true;
                    }
                    else
                    {
                        validator.Result = false;

                    }
                }
            }
        }

        private async Task RunHttpJob(InMemoryJob job)
        {
            var sendHttpRequest = await _httpService.PerformRequestAsync(job.JobDetails.HttpRequest!);
            if (sendHttpRequest.ResponseTimeMs.HasValue)
                job.ResponseTimes.Add(sendHttpRequest.ResponseTimeMs.Value);

            if (sendHttpRequest is { WasSuccess: false, StatusCode: HttpStatusCode.BadGateway })
            {
                // failure
                job.Failed = true; 
                job.Info = sendHttpRequest.Info;
                return;
            }


            foreach (var validator in job.JobDetails.Validators)
            {
                if (validator.ValidatorType == ValidatorType.Content)
                {
                    if (sendHttpRequest.Body.Equals(validator.Value, StringComparison.OrdinalIgnoreCase))
                    {
                        validator.Result = true;
                    }
                    else
                    {
                        validator.Result = false;

                    }
                }
                else if (validator.ValidatorType == ValidatorType.ResponseCode && int.TryParse(validator.Value, out var statusCode))
                {
                    if ((int)sendHttpRequest.StatusCode == statusCode)
                    {
                        validator.Result = true;
                    }
                    else
                    {
                        validator.Result = false;

                    }
                }
                else if (validator.ValidatorType == ValidatorType.Header)
                {
                    if (sendHttpRequest.Headers.TryGetValue(validator.PropertyName!, out var headerValue) && headerValue.Equals(validator.Value, StringComparison.OrdinalIgnoreCase))
                    {
                        validator.Result = true;
                    }
                    else
                    {
                        validator.Result = false;

                    }
                }
            }
        }

    }
}
