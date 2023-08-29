using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache;
using Action_Delay_API_Core.Models.NATS.Responses;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Jobs
{
    public class CacheDelayJob : IBaseJob
    {

        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IQueue _queue;
        private readonly ActionDelayDatabaseContext _dbContext;
        private string _valueToLookFor;



        public CacheDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CacheDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
            _dbContext = dbContext;
        }





        public override string Name => "Single URL Purge Delay Job";
        public override int TargetExecutionSecond => 40;


        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

        public override async Task RunAction()
        {
            // pre-arm all of the locations

            Dictionary<Location, Task> preInitWarmTasks = new();
            foreach (var location in _config.Locations)
            {
                preInitWarmTasks.Add(location, SendRequest(location, CancellationToken.None));
            }

            foreach (var preInitTask in preInitWarmTasks)
            {
                try
                {
                    await preInitTask.Value;
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, $"Failure warming location: {preInitTask.Key.DisplayName ?? preInitTask.Key.Name}");
                }
            }

            foreach (var location in _config.Locations)
            {
                int retries = 5;
                try
                {
                    for (int i = 0; i < retries; i++)
                    {
                        var tryGetResult = await SendRequest(location, CancellationToken.None);
                        if (tryGetResult.IsFailed)
                        {
                            _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, retrying..");
                            continue;
                        }

                        string tryGetCacheStatus = "";



                        var result = tryGetResult.Value;

                        if (result.Headers.TryGetValue(
                                String.IsNullOrEmpty(_config.CacheJob.ProxyURL) == false
                                    ? "Proxy-CF-Cache-Status"
                                    : "CF-Cache-Status", out var cacheStatus))
                        {
                            tryGetCacheStatus = cacheStatus;
                        }

                        if (result.Headers.TryGetValue(
                                String.IsNullOrEmpty(_config.CacheJob.ProxyURL) == false
                                    ? "Proxy-Age"
                                    : "Age", out var cacheAge))
                        {
                            if (String.IsNullOrEmpty(cacheAge) || int.TryParse(cacheAge, out var cacheAgeInt) == false || cacheAgeInt < 10)
                            {
                                _logger.LogInformation($"Error, cache is too new or missing, cache value {cacheAge}, Cache Status: {tryGetCacheStatus}, location: {location.Name}");
                                continue;
                            }
                            else
                            {
                                _logger.LogInformation($"{location.Name} pre-warmed, cache age: {cacheAge}, Cache Status: {tryGetCacheStatus}");
                                break;
                            }
                        }
                        else
                        {
                            _logger.LogInformation($"Error, cache is missing, Cache Status: {tryGetCacheStatus}, location: {location.Name}");
                            continue;
                        }
                    }
           
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, $"Failure warming location {location.Name}");
                }
            }

            try
            {
                _valueToLookFor = $"Date: {DateTime.UtcNow.ToString("R")} GUID: {Guid.NewGuid().ToString("D")}";
                var tryFindData = await _dbContext.GenericJobData.FirstOrDefaultAsync(data => data.JobName == Name);
                if (tryFindData == null)
                {
                    tryFindData = new GenericJobData()
                    {
                        JobName = Name
                    };
                    _dbContext.GenericJobData.Add(tryFindData);
                }
                tryFindData.LastUpdated = DateTime.UtcNow;
                tryFindData.Value = _valueToLookFor;
                tryFindData.Metadata = "Updated";
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Failure updating Generic Job Data");
                throw;

            }


            var newUpdateRequest = new PurgeCacheByURLRequest()
            {
                Files = new[]
                {
                    _config.CacheJob.URL
                }
            };
            var tryPutAPI = await _apiBroker.PurgeSingleURLCache(_config.CacheJob.ZoneId, newUpdateRequest, _config.CacheJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure purging cache, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                throw new InvalidOperationException(
                    $"Failure purging cache, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }


        }

        public  Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>(),
                URL = String.IsNullOrEmpty(_config.CacheJob.ProxyURL) ? _config.CacheJob.URL : $"{_config.CacheJob.ProxyURL}/{location.Name}?url={_config.CacheJob.URL}" // very specific proxy format, see Action-Delay-API-Durable-Object-Proxy for implementation
            };
            if (String.IsNullOrEmpty(_config.CacheJob.ProxyURL) == false &&
                String.IsNullOrEmpty(_config.CacheJob.ProxyAPIKey) == false)
            {
                newRequest.Headers.Add("APIKEY", _config.CacheJob.ProxyAPIKey);
            }
            return  _queue.HTTP(newRequest, location.NATSName ?? location.Name, token);
        }



        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {

            var tryGetResult = await SendRequest(location, token);
            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult(false, "Queue Error");
            }
            var getResponse = tryGetResult.Value;



            _logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

            if (getResponse.StatusCode == HttpStatusCode.OK && getResponse.Body.Equals(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed");
            }
            else
            {
                _logger.LogInformation($"{location.Name} sees {getResponse.Body} instead of {_valueToLookFor}, and {getResponse.StatusCode} instead of 200 / OK! Let's try again...");
                return new RunLocationResult(false, "Undeployed");
            }
        }
    }
}
