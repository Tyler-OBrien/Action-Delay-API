using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using ClickHouse.Client.ADO;
using ClickHouse.Client.Copy;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ClickHouse.Client.Utility;
using System.Data.Common;
using System.Data;

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

        public async Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, CancellationToken token = default)
        {
            try
            {
                await using var connection = CreateConnection();
                if (locations != null && locations.Any())
                {
                    using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                    {
                        DestinationTableName = "job_runs_locations",
                        BatchSize = 100000
                    };

                    await bulkCopyInterface.WriteToServerAsync(
                        locations.Select(server => new object[]
                            {
                                server.JobName, server.LocationName, server.RunTime, server.RunLength, server.RunStatus
                            })
                            .ToArray(), token);
                }

                using var bulkCopyRun = new ClickHouseBulkCopy(connection)
                {
                    DestinationTableName = "job_runs",
                    BatchSize = 100000
                };

                await bulkCopyRun.WriteToServerAsync(
                    new[] { new object[] { run.JobName, run.RunTime, run.RunLength, run.RunStatus } }, token);
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse");
            }
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
