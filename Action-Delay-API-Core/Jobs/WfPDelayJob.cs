using System.Net;
using Action_Delay_API_Core.Broker;
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
    public class WfPJob : IBaseJob
    {
        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IQueue _queue;
        private string _generatedValue { get; set; }

        private string _scriptName { get; set; }
        public override int TargetExecutionSecond => 20;

        public WfPJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WfPJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
        }

        public override string Name => "WfP User Script Delay Job";
        public override string InternalName => "wfp";
        public override async Task PreWarmRunLocation(Location location)
        {
            await SendLocation(location, CancellationToken.None);
        }

        public override async Task JobInit()
        {
            _scriptName = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();
        }

        public override async Task RunAction()
        {
            _logger.LogInformation($"Running {Name} Job");
            _generatedValue = $"{Guid.NewGuid()}-Cookies-Uploaded At {DateTime.UtcNow.ToString("R")} by Action-Delay-API {Program.VERSION} {_config.Location}";
            // Appending 'worker.js' field
            string workerJsContent = $@"export default {{
  async fetch(request, env, ctx) {{
    return new Response('{_generatedValue}');
  }},
}};".ReplaceLineEndings(" ");


            var metadataContent = System.Text.Json.JsonSerializer.Serialize(new
            {
                compatibility_date = "2023-12-17",
                main_module = "worker.js"
            });




            var tryPutAPI = await _apiBroker.UploadWFPScript(workerJsContent, metadataContent, _config.WfPJob.AccountId,
                _config.WfPJob.NamespaceName, _scriptName, _config.WfPJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating WfP User script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating  WfP User script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            this.JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
            _logger.LogInformation("Changed WfP User script...");
        }

        private async Task<Result<SerializableHttpResponse>> SendLocation(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                    { "Worker", location.DisplayName ?? location.Name }
                },
                URL = _config.WfPJob.ScriptUrl + $"/?scriptName={_scriptName}",
                NetType = location.NetType ?? NetType.Either,
                TimeoutMs = 10_000,
                EnableConnectionReuse = false,
            };
            return await _queue.HTTP(newRequest, location.NATSName ?? location.Name, token);
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {

            var tryGetResult = await SendLocation(location, token);

            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult("Queue Error", null, -1);
            }
            var getResponse = tryGetResult.Value;

            _logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess} - Response UTC: {getResponse.ResponseUTC}");

            if (getResponse.Body.Equals(_generatedValue, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
            else
            {
                _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees {getResponse.Body} instead of {_generatedValue}! Status Code: {getResponse.StatusCode} Let's try again...");
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
                using var newCancellationToken = new CancellationTokenSource(10000);
                var tryDeleteWfpScript = await _apiBroker.DeleteWFPScript(_config.WfPJob.AccountId,
                    _config.WfPJob.NamespaceName, _scriptName, _config.WfPJob.API_Key, newCancellationToken.Token);
                if (tryDeleteWfpScript.IsFailed)
                {
                    _logger.LogCritical($"Failure deleting WfP User script, logs: {tryDeleteWfpScript.Errors?.FirstOrDefault()?.Message}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting WfP Script");
            }
        }

    }
}
