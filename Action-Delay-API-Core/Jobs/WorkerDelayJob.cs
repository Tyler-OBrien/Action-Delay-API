using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs
{
    public class WorkerDelayJob : IBaseJob
    {
        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IQueue _queue;
        public override TimeSpan Interval => TimeSpan.FromSeconds(60);

        public WorkerDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkerDelayJob> logger, IQueue queue)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
        }

        public override string Name => "Worker Script Delay Job";

        public override async Task Execute()
        {
            _logger.LogInformation("Runing Delay Job");
            var valueToLookFor = $"{Guid.NewGuid()}-Cookies";
            // Appending 'worker.js' field
            string workerJsContent = $@"export default {{
  async fetch(request, env, ctx) {{
    return new Response('{valueToLookFor}');
  }},
}};".ReplaceLineEndings(" ");


            var metadataContent = System.Text.Json.JsonSerializer.Serialize(new
            {
                compatibility_date = "2023-07-26",
                usage_model = "bundled",
                main_module = "worker.js"
            });




            var tryPutAPI = await _apiBroker.UploadWorkerScript(workerJsContent, metadataContent, _config.DelayJob.AccountId,
                _config.DelayJob.ScriptName, _config.DelayJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating worker script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            // Ok, one job done.
            var locationsTasks = new Dictionary<string, Task<Result<SerializableHttpResponse>>>();
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>(),
                URL = _config.DelayJob.ScriptUrl,
            };
            foreach (var location in _config.Locations)
            {
                var startGet = _queue.HTTP(newRequest, location);
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

                        _logger.LogInformation($"One HTTP Request returned from {location.Key} - Success {getResponse.WasSuccess}");

                        if (getResponse.Body.Equals(valueToLookFor, StringComparison.OrdinalIgnoreCase))
                        {
                            // We got the right value!
                            _logger.LogInformation($"{location.Key} sees the change! Let's remove this and move on..");
                            locationsTasks.Remove(location.Key);
                        }
                        else
                        {
                            _logger.LogInformation($"{location.Key} sees {getResponse.Body} instead of {valueToLookFor}! Let's try again...");
                            // REDO THIS MUCH BETTER LATER, A PROPER QUEUE!!!!
                            var key = location.Key;
                            await Task.Delay(1000);
                            var startGet = _queue.HTTP(newRequest, key);
                            locationsTasks[key] = startGet;
                        }

                    }
                }
            }
        }
    }
}
