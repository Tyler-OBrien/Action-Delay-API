using System.Net;
using Action_Delay_API_Core;
using Action_Delay_API_Core.Broker;
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

public class PageRuleDelayJob : BasePropagationJob
{
    private string _valueToLookFor;
    private int _repeatedRunCount = 1;

    public PageRuleDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config,
        ILogger<PageRuleDelayJob> logger, IQueue queue, IClickHouseService clickHouse,
        ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
    {
    }


    public override int TargetExecutionSecond => 05;

    public override bool Enabled => _config.PageRuleJob != null && (_config.PageRuleJob.Enabled.HasValue == false || _config.PageRuleJob is { Enabled: true });

    public override string Name => "Page Rule Update Delay Job";

    public override string InternalName => "pagerule";


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
            $"{Guid.NewGuid().ToString("N")}.{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.{_config.PageRuleJob.PageRuleHostname}/";
        await RunRepeatableAction();
    }

    public override async Task RunRepeatableAction()
    {
        var newUpdateRequest = new PageRuleUpdateRequest.PageRuleUpdateRequestDTO
        {
            Targets = new PageRuleUpdateRequest.Target[]
            {
                new()
                {
                    TargetTarget = "url",
                    Constraint = new PageRuleUpdateRequest.Constraint
                    {
                        Operator = "matches",
                        Value = $"https://{_config.PageRuleJob.PageRuleHostname}/"
                    }
                }
            },
            Actions = new PageRuleUpdateRequest.Action[]
            {
                new()
                {
                    Id = "forwarding_url",
                    Value = new PageRuleUpdateRequest.Value
                    {
                        StatusCode = 302,
                        Url = "https://" + _repeatedRunCount++ + _valueToLookFor
                    }
                }
            },
            Priority = 1,
            Status = "active"
        };
        var tryPutAPI = await _apiBroker.UpdatePageRule(_config.PageRuleJob.PageRuleId, _config.PageRuleJob.ZoneId,
            newUpdateRequest, _config.PageRuleJob.API_Key, CancellationToken.None);
        if (tryPutAPI.IsFailed)
        {
            _logger.LogCritical($"Failure updating page rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
            if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
            throw new CustomAPIError(
                $"Failure updating page rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
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
                { "Worker", location.DisplayName ?? location.Name }
            },
            URL = $"https://{_config.PageRuleJob.PageRuleHostname}/",
            NetType = location.NetType ?? NetType.Either,
            TimeoutMs = 10_000,
            EnableConnectionReuse = false
        };
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
            _logger.LogInformation(
                $"{location.Name}:{getResponse.GetColoId()} sees the change! Let's remove this and move on..");
            return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs,
                getResponse.GetColoId());
        }

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