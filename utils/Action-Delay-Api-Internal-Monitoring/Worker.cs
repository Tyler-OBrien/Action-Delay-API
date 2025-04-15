using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Jobs.AI;
using Action_Delay_API_Core.Jobs;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ClickHouse.Client.ADO;
using Action_Delay_API_Core.Models.API.CompatAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentResults;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using Action_Delay_API_Core.Extensions;
using Microsoft.AspNetCore.Routing.Constraints;

namespace Action_Delay_Api_Incidient_Monitoring
{

    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly LocalConfig _localConfig;


        public Worker(ILogger<Worker> logger, IServiceScopeFactory scopeFactory, LocalConfig localConfig)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _localConfig = localConfig;
        }

        public async Task<Result<bool>> SendWebhook(string message)
        {
            var tryPost = await new HttpClient().PostAsJsonAsync(_localConfig.SLACK_WEBHOOK_URL, new
            {
                text = message
            });
            if (tryPost.IsSuccessStatusCode == false)
            {
                var responseBody = string.Empty;
                if (tryPost.Content != null)
                {
                    responseBody = await tryPost.Content.ReadAsStringAsync();
                }
                _logger.LogError($"Failed to send webhook - {tryPost.StatusCode} - {responseBody}");
                return FluentResults.Result.Fail($"Failed to send webhook - {tryPost.StatusCode} - {responseBody}");
            }

            return true;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logger.IsEnabled(LogLevel.Information))
                {
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                }

                try
                {
                    using var jobScope = _scopeFactory.CreateScope();
                    using var databaseContext = jobScope.ServiceProvider.GetRequiredService<ActionDelayDatabaseContext>();

                    var pgDate = await CheckPostgres(databaseContext);
                    var  chDate =  await CheckClickhouse();
                    _logger.LogInformation($"Run Over: Postgres Sync Latest Data: {(pgDate.HasValue ? $"{(DateTime.UtcNow - pgDate.Value).TotalMinutes} minutes ago" : "N/A"  )}, Clickhouse Sync Latest Data: {(chDate.HasValue ? $"{(DateTime.UtcNow - chDate.Value).TotalMinutes} minutes ago" : "N/A")} ");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error with anomaly detection");
                }
                await Task.Delay(60_000, stoppingToken);
            }
        }

        private async Task<DateTime?> CheckPostgres(ActionDelayDatabaseContext _dbContext)
        {
            var lastJob = await _dbContext.JobData.OrderByDescending(data => data.CurrentRunTime).FirstOrDefaultAsync();
            if (lastJob != null && lastJob.CurrentRunTime != null)
            {
                // last job
                if ((DateTime.UtcNow - lastJob.CurrentRunTime.Value).TotalMinutes > 2)
                {
                    await SendWebhook(
                        $"{_localConfig.CoreName} has no job updates in the past {(DateTime.UtcNow - lastJob.CurrentRunTime.Value).TotalMinutes} minutes..");
                    _logger.LogInformation($"Fired Alert about Postgres Sync");

                }

                return lastJob.CurrentRunTime;
            }
            else
            {
                await SendWebhook($"{_localConfig.CoreName} Missing jobs?");
            }

            return null;
        }

        private async Task<DateTime?> CheckClickhouse()
        {
            var clickHouse = new ClickHouse(_localConfig.ClickhouseConnectionString, _logger);
            await using var connection = clickHouse.CreateConnection();
            await using var runLengthCommand = connection.CreateCommand();
            runLengthCommand.CommandText = @"Select run_time from job_runs where run_time >  NOW() - INTERVAL '2' DAY  order by run_time desc limit 1;";

            var runLengthResults = await runLengthCommand.ExecuteScalarAsync();

            if (String.IsNullOrWhiteSpace(runLengthResults.ToString()) == false &&
                DateTime.TryParse(runLengthResults.ToString(), out var parsedDateTime))
            {
                if ((DateTime.UtcNow - parsedDateTime).TotalMinutes > 2)
                {
                    await SendWebhook(
                        $"{_localConfig.CoreName} has no job updates in the past {(DateTime.UtcNow - parsedDateTime).TotalMinutes} minutes..");
                    _logger.LogInformation($"Fired Alert about Clickhouse Sync");
                }
                return parsedDateTime;
            }
            else
            {
                await SendWebhook(
                    $"{_localConfig.CoreName} issue parsing result of check clickhouse: {runLengthResults}");
            }

            return null;
        }

      

    }

    public partial class ClickHouse
    {
        private readonly string _clickhouseConnString;
        private readonly ILogger _logger;

        public ClickHouse(string clickhouseConnString, ILogger logger)
        {
            _clickhouseConnString = clickhouseConnString;
            _logger = logger;
            if (String.IsNullOrEmpty(_clickhouseConnString))
            {
                _logger.LogWarning($"Warning: Empty string given for Clickhouse Connection String");
            }
        }

        public ClickHouseConnection CreateConnection()
        {
            return new(_clickhouseConnString);
        }
    }
}