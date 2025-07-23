using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService
    {

        public async Task<List<DeploymentStatistic>> GetCompatibleDeploymentStatistics(CancellationToken token = default)
        {
            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();

            command.CommandText =
                $"SELECT toUnixTimestamp(run_time) AS t, run_length as workers_deploy_lag, toUnixTimestamp(run_time) AS run_time FROM \"default\".\"job_runs\" WHERE run_time >= NOW() - INTERVAL '3' HOUR and job_name = 'worker' and run_status = 'Deployed'  ORDER BY t";
            await using var result = await command.ExecuteReaderAsync(token);
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

        public async Task<OverallAnalytics> GetOverallAnalytics(CancellationToken token)
        {
            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();




            command.CommandText = @"
SELECT
    'job_runs_locations' AS table_name,
    count() AS total_rows
FROM job_runs_locations
WHERE run_time >= now() - INTERVAL 1 DAY


UNION ALL

SELECT
    'job_runs_locations_perf' AS table_name,
    count() AS total_rows
FROM job_runs_locations_perf
WHERE run_time >= now() - INTERVAL 1 DAY;
";

            var response = new OverallAnalytics();
            await using var result = await command.ExecuteReaderAsync(token);
            while (await result.ReadAsync(token))
            {
                var getString = result.GetString("table_name");

                var output = Convert.ToUInt64(result.GetValue("total_rows"));

                if (getString.Equals("job_runs_locations"))
                    response.NormalJobPerLocationRuns = output;
                else
                    response.PerfJobPerLocationRuns = output;
            }

            return response;
        }
    }
}
