using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
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
        private string _generatedValue { get; set; }
        public override int TargetExecutionSecond => 30;

        public WorkerDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkerDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
        }

        public override string Name => "Worker Script Delay Job";
        public override async Task RunAction()
        {
            _logger.LogInformation("Running Delay Job");
            _generatedValue = $"{Guid.NewGuid()}-Cookies";
            // Appending 'worker.js' field
            string workerJsContent = $@"export default {{
  async fetch(request, env, ctx) {{
    return new Response('{_generatedValue}');
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
                throw new InvalidOperationException(
                    $"Failure updating worker script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            _logger.LogInformation("Changed Worker script...");
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>(),
                URL = _config.DelayJob.ScriptUrl,
            };
            var tryGetResult = await _queue.HTTP(newRequest, location.NATSName ?? location.Name, token);

            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult(false, "Queue Error");
            }
            var getResponse = tryGetResult.Value;

            _logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

            if (getResponse.Body.Equals(_generatedValue, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed");
            }
            else
            {
                _logger.LogInformation($"{location.Name} sees {getResponse.Body} instead of {_generatedValue}! Let's try again...");
                return new RunLocationResult(false, "Undeployed");
            }
        }

        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

    }
}
