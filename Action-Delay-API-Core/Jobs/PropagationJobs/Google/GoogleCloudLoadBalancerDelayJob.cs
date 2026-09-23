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
using System.Text.Json;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Google
{
    public class GoogleCloudLoadBalancerDelayJob : BasePropagationJob
    {
        private readonly IGoogleComputeAPIBroker _apiBroker;
        internal GoogleCloudLoadBalancerDelayJobConfig _jobConfig;

        // The redirect target for this run, minus the trailing slash the Location header carries.
        internal string _markerHost;
        internal string _valueToLookFor;
        private int _repeatedRunCount = 1;

        public GoogleCloudLoadBalancerDelayJob(IGoogleComputeAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<GoogleCloudLoadBalancerDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            _jobConfig = _config.GoogleCloudLoadBalancerJob;
            _apiBroker = apiBroker;
        }

        public override int TargetExecutionSecond => 22;
        public override bool Enabled => _config.GoogleCloudLoadBalancerJob != null && (_config.GoogleCloudLoadBalancerJob.Enabled.HasValue == false || _config.GoogleCloudLoadBalancerJob is { Enabled: true });

        public override string Name => "Google Cloud Load Balancer Delay Job";
        public override string InternalName => "googlelb";
        public override string JobType => "GoogleDelay";
        public override string JobDescription => "Delay of a Global External Application Load Balancer URL Map change reaching Google's edge. We update a redirect rule to point at a new target, and request the probe path on edge until the location header is updated";

        // Shaped to this job's measured profile rather than the inherited default. URL Map changes
        // land around 100s and never inside the first minute, so the default ladder's sub-second
        // polling there buys nothing and is billed per request on the load balancer. ~68 polls per
        // location per run becomes ~16.
        //
        // Knee at 60s rather than the Armor job's 90s, matching the shorter propagation. The early
        // step stays at 10s so a genuinely fast propagation is still visible rather than floored.
        public override TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            double secondsUntilNextAlarm = totalWaitTimeInSeconds switch
            {
                > 1800 => 30,
                > 600 => 20,
                > 300 => 10,
                > 60 => 5,
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
            _markerHost = $"{Guid.NewGuid():N}.{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.{_jobConfig.TargetRedirectHostname}";
            _valueToLookFor = $"{_markerHost}/";
            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            // urlMaps.patch is fingerprint-guarded, so every write has to be preceded by a read. This
            // runs before BasePropagationJob stamps ConfirmedUpdateUtc, so it does not skew the delay.
            var tryGetUrlMap = await _apiBroker.GetUrlMap(_jobConfig.ProjectId, _jobConfig.UrlMapName,
                _jobConfig.ServiceAccountJson, CancellationToken.None);
            if (tryGetUrlMap.IsFailed)
            {
                _logger.LogCritical($"Failure reading Google Cloud URL Map, logs: {tryGetUrlMap.Errors?.FirstOrDefault()?.Message}");
                if (tryGetUrlMap.Errors?.FirstOrDefault() is CustomAPIError getError) throw getError;
                throw new CustomAPIError(
                    $"Failure reading Google Cloud URL Map, logs: {tryGetUrlMap.Errors?.FirstOrDefault()?.Message}");
            }

            var newProbeMatcher = new UrlMapPathMatcher()
            {
                Name = _jobConfig.PathMatcherName,
                DefaultService = _jobConfig.DefaultService,
                PathRules = new List<UrlMapPathRule>()
                {
                    new UrlMapPathRule()
                    {
                        Paths = new List<string>() { _jobConfig.ProbePath },
                        UrlRedirect = new UrlMapUrlRedirect()
                        {
                            HostRedirect = $"{_repeatedRunCount++}.{_markerHost}",
                            PathRedirect = "/",
                            RedirectResponseCode = "FOUND",
                            StripQuery = true
                        }
                    }
                }
            };

            // Compute PATCH replaces arrays rather than merging them, so sending our matcher alone would
            // delete every other path matcher on the map - once a minute, silently. Swap ours in by name
            // and pass the rest back through untouched; they stay opaque so nothing this DTO does not
            // model gets stripped on the round trip.
            var mergedMatchers = tryGetUrlMap.Value.PathMatchers?.ToList() ?? new List<JsonElement>();
            var probeMatcherIndex = mergedMatchers.FindIndex(matcher =>
                matcher.TryGetProperty("name", out var name) &&
                string.Equals(name.GetString(), _jobConfig.PathMatcherName, StringComparison.Ordinal));

            if (probeMatcherIndex < 0)
                throw new CustomAPIError(
                    $"URL Map {_jobConfig.UrlMapName} has no path matcher named {_jobConfig.PathMatcherName}. " +
                    "Seed it, along with a host rule pointing at it, before enabling this job.");

            mergedMatchers[probeMatcherIndex] = JsonSerializer.SerializeToElement(newProbeMatcher);

            var newUpdateRequest = new PatchUrlMapRequest()
            {
                Fingerprint = tryGetUrlMap.Value.Fingerprint,
                PathMatchers = mergedMatchers
            };

            var tryPatchAPI = await _apiBroker.PatchUrlMap(_jobConfig.ProjectId, _jobConfig.UrlMapName,
                newUpdateRequest, _jobConfig.ServiceAccountJson, CancellationToken.None);
            if (tryPatchAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating Google Cloud URL Map, logs: {tryPatchAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPatchAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating Google Cloud URL Map, logs: {tryPatchAPI.Errors?.FirstOrDefault()?.Message}");
            }

            // Timed on the patch only - the fingerprint read is setup, not the change being measured.
            this.JobData.APIResponseTimeUtc = tryPatchAPI.Value.ResponseTimeMs;
        }

        private async Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}" },
                },
                URL = $"https://{_jobConfig.LbHostname}{_jobConfig.ProbePath}",
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
                _logger.LogInformation($"{location.Name}: Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return RunLocationResult.TransportFailure(tryGetResult.Errors, null, -1);
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

            // Lax on the status code on purpose - all that matters is whether the redirect target is ours.
            if (locationHeader.EndsWith(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{Name}: {location.Name}:{getResponse.GetColoId()} sees the change!");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs,
                    getResponse.GetColoId());
            }

            if (RateLimitedEventLogger.ShouldLog())
                _logger.LogInformation($"{Name}: {location.DisplayName ?? location.Name}:{getResponse.GetColoId()} sees {locationHeader} instead of {_valueToLookFor}!");

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
