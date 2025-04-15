using Microsoft.Extensions.Options;
using Action_Delay_Api_HealthChecks.Broker;
using Action_Delay_Api_HealthChecks.Models;
using System.Text;

namespace Action_Delay_Api_HealthChecks
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly LocalConfig _localConfig;
        private readonly NATSQueue _natsQueue;
        private readonly SlackWebhookBroker _slackWebhookBroker;

        // Track current state
        private HashSet<string> _currentDownLocations = new();
        private Dictionary<string, string> _locationErrors = new();
        private DateTime _lastNotificationTime = DateTime.MinValue;

        private const int CHECK_INTERVAL_MS = 30_000; // 30 seconds
        private const int RENOTIFICATION_INTERVAL_MIN = 60; // 60 minutes

        public Worker(
            ILogger<Worker> logger,
            IOptions<LocalConfig> probeConfiguration,
            NATSQueue natsQueue,
            SlackWebhookBroker slackBroker)
        {
            _logger = logger;
            _localConfig = probeConfiguration.Value;
            _natsQueue = natsQueue;
            _slackWebhookBroker = slackBroker;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckLocationsHealth(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error running ExecuteAsync HealthChecks");
                }

                await Task.Delay(CHECK_INTERVAL_MS, stoppingToken);
            }
        }

        private async Task CheckLocationsHealth(CancellationToken stoppingToken)
        {
            var locationTasks = _localConfig.Locations.Where(loc => loc.Disabled == false).Select(loc =>
                CheckLocationHealth(loc, stoppingToken)).ToList();

            var responses = await Task.WhenAll(locationTasks);
            var failedResponses = responses.Where(r => r.HasError).ToList();

            var newDownLocations = failedResponses.Select(r => r.LocationName).ToHashSet();

            if (ShouldSendNotification(newDownLocations))
            {
                await SendSlackNotification(failedResponses, newDownLocations);
                _lastNotificationTime = DateTime.UtcNow;
            }

            // Update state for next run
            _currentDownLocations = newDownLocations;
            _locationErrors = failedResponses.ToDictionary(
                r => r.LocationName,
                r => r.ErrorMessage ?? "Unknown error");
        }

        private bool ShouldSendNotification(HashSet<string> newDownLocations)
        {
            // Send notification if:
            // 1. The set of down locations has changed
            // 2. OR it's been more than RENOTIFICATION_INTERVAL_MIN since last notification
            // AND there are actually down locations to report
            return (
                (newDownLocations.SetEquals(_currentDownLocations) == false ||
                 
                 (
                DateTime.UtcNow - _lastNotificationTime > TimeSpan.FromMinutes(RENOTIFICATION_INTERVAL_MIN))
                && newDownLocations.Any())
            );
        }

        private async Task SendSlackNotification(
            List<LocationCheckResponse> failedResponses,
            HashSet<string> newDownLocations)
        {
            var message = BuildNotificationMessage(failedResponses, newDownLocations);
            await _slackWebhookBroker.SendWebhook(_localConfig.SLACK_WEBHOOK_URL, message);
        }

        private string BuildNotificationMessage(
            List<LocationCheckResponse> failedResponses,
            HashSet<string> newDownLocations)
        {
            var sb = new StringBuilder();

            // Report newly down locations
            var newlyDown = newDownLocations.Except(_currentDownLocations);
            foreach (var location in newlyDown)
            {
                var error = failedResponses.First(r => r.LocationName == location).ErrorMessage;
                sb.AppendLine($"🔴 *{location}* is down - {error}");
            }

            // Report recovered locations
            var recovered = _currentDownLocations.Except(newDownLocations);
            foreach (var location in recovered)
            {
                sb.AppendLine($"🟢 *{location}* has recovered");
            }

            // If this is a re-notification of existing issues
            if (!newlyDown.Any() && !recovered.Any() && newDownLocations.Any())
            {
                sb.AppendLine("⚠️ Reminder: The following locations are still down:");
            }

            // Always append current state if there are any down locations
            if (newDownLocations.Any())
            {
                sb.AppendLine("\nCurrently down locations:");
                sb.AppendLine(string.Join(", ", newDownLocations));
            }

            return sb.ToString().TrimEnd();
        }

        private async Task<LocationCheckResponse> CheckLocationHealth(
            Location location,
            CancellationToken stoppingToken)
        {
            for (int i = 0; i < 3; i++)
            {
                bool shouldErrorLastRun = i > 1;
                try
                {
                    var request = CreateHealthCheckRequest(location);
                    var response = await _natsQueue.HTTP(request, location, stoppingToken);

                    if (response.IsFailed || response.ValueOrDefault == null)
                    {
                        if (!shouldErrorLastRun) continue;

                        return CreateErrorResponse(location,
                            response.Errors?.FirstOrDefault()?.Message ?? "Unknown error");
                    }

                    var msg = response.ValueOrDefault;
                    if (msg.ProxyFailure)
                    {
                        if (!shouldErrorLastRun) continue;


                        return CreateErrorResponse(location, $"Proxy Failure: {msg.Info}");
                    }

                    if (!msg.WasSuccess)
                    {
                        if (!shouldErrorLastRun) continue;

                        return CreateErrorResponse(location, $"Request failed: {msg.Info}");
                    }

                    return new LocationCheckResponse
                    {
                        LocationName = location.DisplayName ?? location.Name,
                        HasError = false
                    };
                }
                catch (Exception ex)
                {
                    if (!shouldErrorLastRun) continue;

                    return CreateErrorResponse(location, $"Exception: {ex.Message}");
                }
            }
            return CreateErrorResponse(location, $"Error Running Location");

        }

        private static NATSHttpRequest CreateHealthCheckRequest(Location location)
        {
            var request = new NATSHttpRequest
            {
                Headers = new Dictionary<string, string>
                {
                    { "User-Agent", "Action-Delay-API Health Checks" },
                    { "Worker", location.DisplayName ?? location.Name },
                },
                URL = "https://cloudflare.com/cdn-cgi/trace",
                TimeoutMs = 13_000,
                EnableConnectionReuse = true,
                Method = MethodType.GET,
                ReturnBody = false,
                RetriesCount = 1,
                ReturnBodyOnError = true
            };

            request.SetDefaultsFromLocation(location);
            return request;
        }

        private static LocationCheckResponse CreateErrorResponse(
            Location location,
            string errorMessage)
        {
            return new LocationCheckResponse
            {
                LocationName = location.DisplayName ?? location.Name,
                ErrorMessage = errorMessage,
                HasError = true
            };
        }
    }

    public class LocationCheckResponse
    {
        public string LocationName { get; set; } = string.Empty;
        public bool HasError { get; set; }
        public string? ErrorMessage { get; set; }
    }
}