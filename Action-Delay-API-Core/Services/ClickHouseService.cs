using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using ClickHouse.Client.ADO;
using ClickHouse.Client.Copy;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Action_Delay_API_Core.Services
{
    public class ClickHouseService : IClickHouseService
    {
        private readonly LocalConfig _config;
        private readonly ILogger _logger;



        public ClickHouseService(IOptions<LocalConfig> baseConfigurationOptions, ILogger<ClickHouseService> logger)
        {
            _config = baseConfigurationOptions.Value;
            _logger = logger;
        }

        public ClickHouseConnection CreateConnection()
        {
            return new(_config.ClickhouseConnectionString);
        }

        public async Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun> locations, CancellationToken token = default)
        {
            try
            {
                await using var connection = CreateConnection();
                using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                {
                    DestinationTableName = "job_runs_locations",
                    BatchSize = 100000
                };

                await bulkCopyInterface.WriteToServerAsync(
                    locations.Select(server => new object[]
                            { server.JobName, server.LocationName, server.RunTime, server.RunLength, server.RunStatus })
                        .ToArray(), token);

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

    }
}
