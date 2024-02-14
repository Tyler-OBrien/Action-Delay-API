using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using ClickHouse.Client.ADO;
using ClickHouse.Client.Copy;
using System.Data.Common;
using NATS.Client.JetStream.Models;
using ClickHouse.Client.Utility;
using Action_Delay_API_Core.Models.API.Quick;

namespace Action_Delay_API_Core.Services
{
    public class ClickHouseService : IClickHouseService
    {
        private readonly LocalConfig _config;
        private readonly ILogger _logger;



        public ClickHouseService(LocalConfig baseConfigurationOptions, ILogger<ClickHouseService> logger)
        {
            _config = baseConfigurationOptions;
            _logger = logger;
            if (String.IsNullOrEmpty(_config.ClickhouseConnectionString))
            {
                _logger.LogWarning($"Warning: Empty string given for Clickhouse Connection String");
            }
        }

        public ClickHouseConnection CreateConnection()
        {
            return new(_config.ClickhouseConnectionString);
        }

        public async Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, ClickhouseAPIError? apiError = null, CancellationToken token = default)
        {
            try
            {
                await using var connection = CreateConnection();
                try
                {
                    if (locations != null && locations.Any())
                    {
                        using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "job_runs_locations",
                            BatchSize = 100000
                        };
                        await bulkCopyInterface.InitAsync();
                        await bulkCopyInterface.WriteToServerAsync(
                            locations.Select(server => new object[]
                                {
                                    server.JobName, server.LocationName, server.RunTime, server.RunLength,
                                    server.RunStatus, server.ResponseLatency, server.ColoId
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_locations");
                    throw;
                }

                try
                {
                    using var bulkCopyRun = new ClickHouseBulkCopy(connection)
                    {
                        DestinationTableName = "job_runs",
                        BatchSize = 100000
                    };
                    await bulkCopyRun.InitAsync();

                    await bulkCopyRun.WriteToServerAsync(
                        new[]
                        {
                            new object[]
                            {
                                run.JobName, run.RunTime, run.RunLength, run.RunStatus,
                                apiError?.ErrorDescription ?? string.Empty, run.ResponseLatency
                            }
                        }, token);

                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs");
                    throw;
                }
                try
                {
                    if (apiError != null)
                    {
                        using var bulkCopyApiError = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "api_errors",
                            BatchSize = 100000
                        };
                        await bulkCopyApiError.InitAsync();
                        await bulkCopyApiError.WriteToServerAsync(
                            new[]
                            {
                                new object[]
                                {
                                    apiError.JobName, apiError.RunTime, apiError.ErrorType, apiError.ErrorDescription,
                                    apiError.ErrorHash, apiError.ResponseLatency
                                }
                            }, token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse api_errors");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse");
            }
        }




        public async Task<List<QuickAnalyticsAPI>> GetQuickAnalytics(string jobName, CancellationToken token = default)
        {
            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();

            command.AddParameter("jobName", "String", jobName);

            command.CommandText = @"SELECT 
    'Last 1 Day' as period,
    median(run_length) as median_run_length
FROM 
    job_runs
WHERE 
    job_name = {jobName:String} 
    and run_status = 'Deployed'
    and run_time > now() - INTERVAL 1 DAY

UNION ALL

SELECT 
    'Last 30 Days' as period,
    median(run_length) as median_run_length
FROM 
    job_runs
WHERE 
    job_name = {jobName:String} 
    and run_status = 'Deployed'
    and run_time > now() - INTERVAL 30 DAY

UNION ALL

SELECT 
    'Last 90 Days' as period,
    median(run_length) as median_run_length
FROM 
    job_runs
WHERE 
    job_name = {jobName:String} 
    and run_status = 'Deployed'
    and run_time > now() - INTERVAL 90 DAY
";
            var result = await command.ExecuteReaderAsync(token);
            List<QuickAnalyticsAPI> data = new List<QuickAnalyticsAPI>(3);
            while (await result.ReadAsync(token))
            {
                data.Add(new QuickAnalyticsAPI()
                {
                    Period = result["period"].ToString(),
                    MedianRunLength = result["median_run_length"].ToString(),
                });
            }
            return data;
        }

        public async Task<List<DeploymentStatistic>> GetCompatibleDeploymentStatistics(CancellationToken token = default)
        {
            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();

            command.CommandText =
                $"SELECT toUnixTimestamp(run_time) AS t, run_length as workers_deploy_lag, toUnixTimestamp(run_time) AS run_time FROM \"default\".\"job_runs\" WHERE run_time >= NOW() - INTERVAL '3' HOUR and job_name = 'Worker Script Delay Job' and run_status = 'Deployed'  ORDER BY t";
            var result = await command.ExecuteReaderAsync(token);
            List<DeploymentStatistic> data = new List<DeploymentStatistic>(3 * 60);
            while (await result.ReadAsync(token))
            {
                data.Add(CompatDeploymentStatsFromReader(result));
            }
            return data;
        }
        private DeploymentStatistic CompatDeploymentStatsFromReader(DbDataReader reader)
        {
            return new DeploymentStatistic()
            {
                Deployed = "true",
                RunLength = ulong.Parse(reader["workers_deploy_lag"].ToString()),
                Time = DateTimeOffset.FromUnixTimeSeconds(long.Parse(reader["t"].ToString())).ToUnixTimeMilliseconds().ToString(),
                RunTime = (ulong)DateTimeOffset.FromUnixTimeSeconds(long.Parse(reader["run_time"].ToString())).ToUnixTimeMilliseconds(),
            };
        }


    }
}
