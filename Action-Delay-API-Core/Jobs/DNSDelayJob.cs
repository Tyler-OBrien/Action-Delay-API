using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.NATS.Requests;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs
{
    public class DNSDelayJob : IBaseJob
    {

        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IQueue _queue;

        public DNSDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<DNSDelayJob> logger, IQueue queue)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
        }





        public override TimeSpan Interval => TimeSpan.FromSeconds(60);
        public override string Name => "DNS Delay Job";

        public override async Task Execute()
        {
            var newValueToLookFor = $"Is Walshy Still Breaking Things? Yes - Last Updated: {DateTime.UtcNow:R}";
            var newUpdateRequest = new UpdateRecordRequest()
            {
                Comment = "Blame Walshy",
                Content = newValueToLookFor,
                Name = _config.DNSJob.Name,
                Proxied = false,
                Tags = new[] { "Blame-Walshy", "Free-Canadians", "If-your-reading-this-im-sorry" },
                Ttl = 1,
                Type = "TXT"
            };
            var tryPutAPI = await _apiBroker.UpdateDNSRecord(_config.DNSJob.RecordId, _config.DNSJob.ZoneId, newUpdateRequest, _config.DNSJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating worker script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            // Ok, one job done.
            var locationsTasks = new Dictionary<string, Task<Result<SerializableDNSResponse>>>();
            var newRequest = new NATSDNSRequest()
            {
                QueryName = _config.DNSJob.Name,
                QueryType = "TXT",
                DnsServer = _config.DNSJob.NameServers
            };
            foreach (var location in _config.Locations)
            {
                var startGet = _queue.DNS(newRequest, location);
                locationsTasks.Add(location, startGet);
            }

            while (locationsTasks.Any())
            {
                foreach (var location in locationsTasks)
                {
                    if (location.Value.IsCompleted)
                    {
                        var tryGetResult = await location.Value;
                        if (tryGetResult.IsFailed)
                        {
                            _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}");
                            locationsTasks.Remove(location.Key);
                            continue;
                        }

                        var getResponse = tryGetResult.Value;

                        _logger.LogInformation($"One DNS Request returned from {location.Key} - Success {getResponse.ResponseCode}");
                        string tryGetAnswer = getResponse.Answers.FirstOrDefault()?.Value ?? "";
                        if (tryGetAnswer.Equals(newValueToLookFor, StringComparison.OrdinalIgnoreCase))
                        {
                            // We got the right value!
                            _logger.LogInformation($"{location.Key} sees the change! Let's remove this and move on..");
                            locationsTasks.Remove(location.Key);
                        }
                        else
                        {
                            _logger.LogInformation($"{location.Key} sees {tryGetAnswer} instead of {newValueToLookFor}! Let's try again...");
                            // REDO THIS MUCH BETTER LATER, A PROPER QUEUE!!!!
                            var key = location.Key;
                            await Task.Delay(1000);
                            var startGet = _queue.DNS(newRequest, key);
                            locationsTasks[key] = startGet;
                        }

                    }
                }
            }
        }
    }
}
