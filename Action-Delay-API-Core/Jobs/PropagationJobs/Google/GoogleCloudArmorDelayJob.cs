using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using System.Net;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Google
{
    public class GoogleCloudArmorDelayJob : BasePropagationJob
    {
        private readonly IGoogleComputeAPIBroker _apiBroker;
        internal GoogleCloudArmorDelayJobConfig _jobConfig;

        // The marker lives in the *request*, not the response: each run rewrites the rule to match a
        // fresh header value, so a location returning 403 can only be holding this run's rule - the
        // previous rule matched a value we no longer send. That leaves no stale-response ambiguity.
        internal string _valueToLookFor;

        private int _repeatedRunCount = 1;

        public GoogleCloudArmorDelayJob(IGoogleComputeAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<GoogleCloudArmorDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider)
            : this(config.Value.GoogleCloudArmorJob, apiBroker, config, logger, queue, clickHouse, dbContext, locationProvider)
        {
        }

        // Lets a subclass drive the same probe against a different policy - the edge variant differs
        // only in which config section it reads.
        protected GoogleCloudArmorDelayJob(GoogleCloudArmorDelayJobConfig jobConfig, IGoogleComputeAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<GoogleCloudArmorDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            _jobConfig = jobConfig;
            _apiBroker = apiBroker;
        }

        public override int TargetExecutionSecond => 24;
        public override bool Enabled => _jobConfig != null && (_jobConfig.Enabled.HasValue == false || _jobConfig is { Enabled: true });

        public override string Name => "Google Cloud Armor Delay Job";
        public override string InternalName => "googlearmor";
        public override string JobType => "GoogleDelay";
        public override string JobDescription => "Delay of a Cloud Armor security policy rule reaching Google's edge. The rule denies requests carrying a marker header, and we send that header on edge until we see the block.";

        // Shaped to this job's measured profile rather than the inherited default. Propagation lands
        // consistently around 160s and never inside the first 90, so polling there observes nothing
        // while being billed twice per probe - once by the load balancer, once by the policy. At 63
        // locations the default ladder cost ~85 polls per location per run; this costs ~24.
        //
        // The early step is 10s rather than something coarser on purpose: this job exists to detect
        // changes in propagation time, and a ladder that cannot resolve below 20s would hide exactly
        // the improvement it is meant to report.
        public override TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            double secondsUntilNextAlarm = totalWaitTimeInSeconds switch
            {
                > 1800 => 30,
                > 600 => 20,
                > 300 => 10,
                > 90 => 5,
                _ => 10,
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
            _valueToLookFor = $"{Guid.NewGuid():N}.{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            // Header keys are lower-cased in Cloud Armor's request.headers map, so match on the lower form.
            var headerName = _jobConfig.ProbeHeaderName.ToLowerInvariant();
            var newUpdateRequest = new PatchSecurityPolicyRuleRequest()
            {
                Description = $"Action Delay API propagation probe - rewritten each run {_repeatedRunCount++}",
                Match = new SecurityPolicyRuleMatch()
                {
                    Expr = new SecurityPolicyRuleExpr()
                    {
                        Expression = $"has(request.headers['{headerName}']) && request.headers['{headerName}'] == '{_valueToLookFor}'"
                    }
                },
                Action = "deny(403)",
                Preview = false
            };

            var tryPatchAPI = await _apiBroker.PatchSecurityPolicyRule(_jobConfig.ProjectId,
                _jobConfig.SecurityPolicyName, _jobConfig.RulePriority, newUpdateRequest,
                _jobConfig.ServiceAccountJson, CancellationToken.None);
            if (tryPatchAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating Cloud Armor rule, logs: {tryPatchAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPatchAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating Cloud Armor rule, logs: {tryPatchAPI.Errors?.FirstOrDefault()?.Message}");
            }

            this.JobData.APIResponseTimeUtc = tryPatchAPI.Value.ResponseTimeMs;
        }

        private async Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}" },
                    { _jobConfig.ProbeHeaderName, _valueToLookFor ?? string.Empty },
                },
                URL = $"https://{_jobConfig.LbHostname}{_jobConfig.ProbePath}",
                TimeoutMs = 10_000,
                EnableConnectionReuse = false,
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
                _logger.LogInformation($"{location.Name}: Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return RunLocationResult.TransportFailure(tryGetResult.Errors, null, -1);
            }

            var getResponse = tryGetResult.Value;

            if (getResponse.StatusCode == HttpStatusCode.Forbidden)
            {
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{Name}: {location.Name}:{getResponse.GetColoId()} sees the change!");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs,
                    getResponse.GetColoId());
            }

            if (RateLimitedEventLogger.ShouldLog())
                _logger.LogInformation($"{Name}: {location.DisplayName ?? location.Name}:{getResponse.GetColoId()} sees {getResponse.StatusCode} instead of {HttpStatusCode.Forbidden}!");

            // Only after the match attempt - a successful run's response is itself a non-success code.
            if (getResponse is { WasSuccess: false } && getResponse.IsProbeAbort())
            {
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} probe abort on {getResponse.StatusCode}, aborting loc");
                return RunLocationResult.FromProbe(getResponse, null, getResponse.GetColoId());
            }

            return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs,
                getResponse.GetColoId());
        }
    }
}
