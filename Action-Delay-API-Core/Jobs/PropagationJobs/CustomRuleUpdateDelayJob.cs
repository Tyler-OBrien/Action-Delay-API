using System.Net;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Jobs.PropagationJobs;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs
{
    public class CustomRuleUpdateDelayJob : BasePropagationJob
    {

 
        private string _valueToLookFor;
        private int _repeatedRunCount = 1;
        private string _specialPath;

        public CustomRuleUpdateDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CustomRuleUpdateDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
        {
        }





        public override int TargetExecutionSecond => 50;

        public override bool Enabled => _config.WAFJob != null && (_config.WAFJob.Enabled.HasValue == false || _config.WAFJob is { Enabled: true });

        public override string Name => "Custom Rule Block Delay Job";

        public override string InternalName => "waf";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "Delay of Updating a Custom WAF Rule";



        // This job is always slow, so doing tons of requests in the first second when it's never been that fast in its entire life is just a waste.
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

        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

        public override async Task PreWarmRunLocation(Location location)
        {
            await SendRequest(location, CancellationToken.None);
        }

        public override async Task RunAction()
        {
            _valueToLookFor = $"You've been blocked - Last Updated: {DateTime.UtcNow:R} - Action Delay API {Program.VERSION} {_config.Location}";
            _specialPath = DateTime.UtcNow.ToFileTime().ToString();
            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            var newUpdateRequest = new UpdateCustomRuleRequest.UpdateCustomRuleRequestDTO()
            {
                Action = "Block",
                ActionParameters = new UpdateCustomRuleRequest.ActionParameters()
                {
                    Response = new UpdateCustomRuleRequest.Response()
                    {
                        Content = _valueToLookFor + $" {_repeatedRunCount++}",
                        StatusCode = 415,
                        ContentType = "text/html"
                    }
                },
                Description = "Auto updating block me pls rule",
                Enabled = true,
                Expression = $"(http.host eq \"{_config.WAFJob.HostName}\" and http.request.uri.path in {{\"/\" \"/{_specialPath}\" \"/hii\"}})",
                Id = _config.WAFJob.RuleId,
                Ref = _config.WAFJob.RuleId,
            };
            var tryPutAPI = await _apiBroker.UpdateCustomRule(_config.WAFJob.RuleId, _config.WAFJob.RuleSetId, _config.WAFJob.ZoneId, newUpdateRequest, _config.WAFJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating custom rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating custom rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            this.JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
        }


        private async Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                },
                URL = "https://" + _config.WAFJob.HostName + $"/{_specialPath}",
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
                return new RunLocationResult( "Queue Error", null, -1);
            }
            var getResponse = tryGetResult.Value;

            //_logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

            if (getResponse.StatusCode == HttpStatusCode.UnsupportedMediaType && getResponse.Body.StartsWith(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
            else
            {
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees {getResponse.Body} instead of {_valueToLookFor}, and {getResponse.StatusCode} instead of {HttpStatusCode.UnsupportedMediaType.ToString()}! Let's try again...");
                if (getResponse is { WasSuccess: false, ProxyFailure: true })
                {
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING!!!!! Headers: {String.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                    return new RunLocationResult("Proxy Error", null, getResponse.GetColoId());
                }
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
        }

    }
}
