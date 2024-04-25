using Action_Delay_API_Core.Models.API.Quick;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClickHouse.Client.Utility;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService
    {


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
UNION ALL
SELECT 
  toString(run_time) as period,
  toFloat64(run_length) as run_length
FROM 
    job_runs
WHERE 
    job_name = {jobName:String}
    and run_status = 'Deployed'
    and run_time > now() - INTERVAL 1 DAY
ORDER BY run_length DESC
LIMIT 1;
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

    }
}
