using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Responses;
using System.Net;
using Action_Delay_API_Core.Extensions;

namespace Action_Delay_API_Core.Jobs.PropagationJobs
{
    public class CFForSaaSCustomHostnameJob : BasePropagationJob
    {
        private string _customHostnameId { get; set; }

        public override int TargetExecutionSecond => 20;

        public override bool Enabled => _config.CustomHostnamesDelayJob != null && (_config.CustomHostnamesDelayJob.Enabled.HasValue == false || _config.CustomHostnamesDelayJob is { Enabled: true });


        public CFForSaaSCustomHostnameJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CFForSaaSCustomHostnameJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
        {
        }

        public override TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            double secondsUntilNextAlarm = totalWaitTimeInSeconds switch
            {
                > 1800 => 30,
                > 600 => 15,
                > 120 => 10,
                > 60 => 4,
                > 30 => 2,
                > 5 => 0.5,
                > 2 => 0.5,
                _ => 0.5,
            };
            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }
        public override string Name => "CF for SaaS Delay Job";
        public override string InternalName => "customhostnames";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "Delay of setting up a new Custom Hostname Without TLS";


        public override TimeSpan RepeatActionAfter => TimeSpan.FromDays(30);

        public override async Task PreWarmRunLocation(Location location)
        {
            await RunLocation(location, CancellationToken.None);
        }

        public override async Task JobInit()
        {
           
        }

        public override async Task RunAction()
        {
            _logger.LogInformation($"Running {Name} Job");
            await RunRepeatableAction();
        }

        
        public override async Task RunRepeatableAction()
        {

            var getCustomHostname = await _apiBroker.ListCustomHostname(_config.CustomHostnamesDelayJob.TargetHostname,
                _config.CustomHostnamesDelayJob.ZoneId, _config.CustomHostnamesDelayJob.API_Key,
                CancellationToken.None);
            if (getCustomHostname.IsFailed)
            {
                _logger.LogCritical($"Failure listing custom hostnames, logs: {getCustomHostname.Errors?.FirstOrDefault()?.Message}");
                if (getCustomHostname.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating listing custom hostnames, logs: {getCustomHostname.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            if (getCustomHostname.Value.Result?.Any() ?? false)
            {
                var getCustomHostnameObj = getCustomHostname.Value.Result.First(); // only one allowed per hostname
                var tryDeleteCustomHostname = await _apiBroker.DeleteCustomHostname(getCustomHostnameObj.Id,
                    _config.CustomHostnamesDelayJob.ZoneId, _config.CustomHostnamesDelayJob.API_Key,
                    CancellationToken.None);
                if (tryDeleteCustomHostname.IsFailed)
                {
                    _logger.LogCritical($"Failure deleting custom hostname {getCustomHostnameObj.Id}, status: {getCustomHostnameObj.Status}, logs: {tryDeleteCustomHostname.Errors?.FirstOrDefault()?.Message}");
                    if (tryDeleteCustomHostname.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                    throw new CustomAPIError(
                        $"Failure updating deleting custom hostname, logs: {tryDeleteCustomHostname.Errors?.FirstOrDefault()?.Message}");
                    return;
                }
            }


            var tryPutAPI = await _apiBroker.CreateCustomHostname(_config.CustomHostnamesDelayJob.ZoneId, _config.CustomHostnamesDelayJob.TargetHostname, _config.CustomHostnamesDelayJob.API_Key,
                CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure creating custom hostname, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure creating custom hostname, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            _customHostnameId = tryPutAPI.Value.Result.Id;
            this.JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
            _logger.LogInformation("Created Custom Hostname...");
        }

        private async Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                },
                URL = "https://" + _config.CustomHostnamesDelayJob.TargetHostname + $"/",
                TimeoutMs = 10_000,
                NoResponseHeaders = true,
            };
            newRequest.SetDefaultsFromLocation(location);

            return await _queue.HTTP(newRequest, location, token);
        }


        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var tryGetResult = await SendRequest(location, token);

            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult("Queue Error", null, -1);
            }
            var getResponse = tryGetResult.Value;

            //_logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

            if (getResponse.StatusCode == HttpStatusCode.OK && getResponse.Body.StartsWith("Hello World!", StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
            else
            {
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees {getResponse.Body.Truncate(10)} instead of Hello World!, and {getResponse.StatusCode} instead of {HttpStatusCode.UnsupportedMediaType.ToString()}! Let's try again...");
                if (getResponse is { WasSuccess: false, ProxyFailure: true })
                {
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING!!!!! Headers: {String.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                    return new RunLocationResult("Proxy Error", null, getResponse.GetColoId());
                }
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
        }

        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
            try
            {
                using var newCancellationToken = new CancellationTokenSource(15000);
                var tryDeleteCustomHostname = await _apiBroker.DeleteCustomHostname(_customHostnameId, _config.CustomHostnamesDelayJob.ZoneId, _config.CustomHostnamesDelayJob.API_Key, newCancellationToken.Token);
                if (tryDeleteCustomHostname.IsFailed)
                {
                    _logger.LogCritical($"Failure deleting Custom Hostname, logs: {tryDeleteCustomHostname.Errors?.FirstOrDefault()?.Message}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Custom Hostname");
            }
        }

    }
}
