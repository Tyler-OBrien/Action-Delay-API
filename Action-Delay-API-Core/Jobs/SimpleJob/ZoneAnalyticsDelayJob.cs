﻿using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Local;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;

namespace Action_Delay_API_Core.Jobs.SimpleJob;

public class ZoneAnalyticsDelayJob : BaseJob
{
    public ZoneAnalyticsDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<ZoneAnalyticsDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
    {
    }
    public override int TargetExecutionSecond => 25;
    public override async Task RunAction()
    {
        // depends on plan, maybe shouldn't be hardcoded?
        var datetimeGreaterThan = DateTime.UtcNow.AddDays(-25);


        var tryGetAnalytic = await _apiBroker.GetLastZoneAnalytic(_config.ZoneAnalyticsDelayJob.ZoneId, datetimeGreaterThan.ToString("O"), _config.ZoneAnalyticsDelayJob.API_Key, CancellationToken.None);
        if (tryGetAnalytic.IsFailed)
        {
            _logger.LogCritical($"Failure getting Zone Analytic, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
            if (tryGetAnalytic.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
            throw new CustomAPIError(
                $"Failure getting Zone Analytic, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
            return;
        }

        var data = tryGetAnalytic.Value!.Result!.Viewer.Zones.First().HttpRequestsAdaptive.First().Datetime;

        this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - data).TotalMilliseconds > 0 ? (ulong)(DateTime.UtcNow - data).TotalMilliseconds : 0;
        this.JobData.CurrentRunStatus = Models.Jobs.Status.STATUS_DEPLOYED;
        this.JobData.APIResponseTimeUtc = tryGetAnalytic.Value.ResponseTimeMs;
        await InsertRunResult();
        await TrySave(true);
    }



    public override string Name => "Zone Analytics Delay Job";
    public override string InternalName => "analytics";

}