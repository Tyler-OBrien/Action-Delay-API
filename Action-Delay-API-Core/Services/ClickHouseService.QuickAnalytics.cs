using Action_Delay_API_Core.Models.API.CompatAPI;
using System;
using System.Collections.Generic;
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
