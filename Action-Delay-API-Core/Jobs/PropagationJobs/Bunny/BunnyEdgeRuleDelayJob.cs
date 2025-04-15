using System;
using System.Net;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Jobs.PropagationJobs;
using Action_Delay_API_Core.Models.BunnyAPI.EdgeRules;
using Action_Delay_API_Core.Models.CloudflareAPI.PageRules;
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
    public class BunnyEdgeRuleDelayJob : BasePropagationJob
    {
        private readonly IBunnyAPIBroker _apiBroker;

        private string _valueToLookFor;
        private int _repeatedRunCount = 1;

        public BunnyEdgeRuleDelayJob(IBunnyAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<BunnyEdgeRuleDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(config, logger, clickHouse, dbContext, queue)

        {
            _apiBroker = apiBroker;
        }


        public override int TargetExecutionSecond => 05;

        public override bool Enabled => _config.BunnyEdgeRuleJob != null &&
                                        (_config.BunnyEdgeRuleJob.Enabled.HasValue == false || _config.BunnyEdgeRuleJob is
                                            { Enabled: true });

        public override string Name => "Bunny Edge Rule Delay Job";
        public override string InternalName => "bunnyedgerule";

        public override string JobType => "BunnyDelay";

        public override string JobDescription => "Delay of an edge rule update being reflected on Edge";




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
            _valueToLookFor =
                $"{Guid.NewGuid().ToString("N")}.{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.{_config.BunnyEdgeRuleJob.TargetBaseHostname}/";
            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            var newUpdateRequest = new BunnyEdgeRuleDto()
            {
              ActionType = 1,
              Description = "Auto Update",
              Enabled = true,
              Guid = _config.BunnyEdgeRuleJob.EdgeRuleGuid,
              ActionParameter1 = "https://" + _repeatedRunCount++ + _valueToLookFor,
              ActionParameter2 = "302",
              TriggerMatchingType = 0,
              Triggers = new BunnyEdgeRuleDtoTrigger[]
              {
                  new BunnyEdgeRuleDtoTrigger()
                  {
                      PatternMatches = new []{ "*/edge-rule-test"},
                      PatternMatchingType = 0,
                      Type = 0
                  }
              }

            };
            var tryPutAPI = await _apiBroker.UpdateEdgeRule(_config.BunnyEdgeRuleJob.ZoneId, newUpdateRequest, _config.BunnyEdgeRuleJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating edge rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating edge rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
        }



        private async Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest
            {
                Headers = new Dictionary<string, string>
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}" },
                },
                URL = $"https://{_config.BunnyEdgeRuleJob.TargetBaseHostname}/edge-rule-test",
                TimeoutMs = 10_000,
                EnableConnectionReuse = false,
                ResponseHeaders = new List<string>()
                {
                    "location"
                }
            };
            newRequest.SetDefaultsFromLocation(location);

            return await _queue.HTTP(newRequest, location, token);
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var tryGetResult = await SendRequest(location, token);

            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation(
                    $"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult("Queue Error", null, -1);
            }

            var getResponse = tryGetResult.Value;

            var locationHeader = string.Empty;
            if (getResponse.Headers.TryGetValue("Location", out var tryGetLocationHeader))
            {
                locationHeader = tryGetLocationHeader;
            }

            // don't ask.
            if (getResponse.Headers.TryGetValue("location", out var tryGetLocationHeader2))
            {
                locationHeader = tryGetLocationHeader2;
            }


            //_logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");
            // super lax on purpose, idc about response codes or anything, just if its returning the right location header/was updated
            if (locationHeader.EndsWith(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation(
                        $"{location.Name}:{getResponse.GetColoId()} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs,
                    getResponse.GetColoId());
            }

            if (RateLimitedEventLogger.ShouldLog())
                _logger.LogInformation(
                    $"{location.Name}:{getResponse.GetColoId()} sees {locationHeader} instead of {_valueToLookFor}, and {getResponse.StatusCode} instead of {HttpStatusCode.UnsupportedMediaType.ToString()}! Let's try again...");
            if (getResponse is { WasSuccess: false, ProxyFailure: true })
            {
                _logger.LogInformation(
                    $"{location.Name}:{getResponse.GetColoId()} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING!!!!! Headers: {string.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                return new RunLocationResult("Proxy Error", null, getResponse.GetColoId());
            }

            return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs,
                getResponse.GetColoId());
        }

    }
}
