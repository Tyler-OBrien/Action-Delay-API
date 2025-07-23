using Action_Delay_API_Core.Models.API.Quick;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClickHouse.Client.Utility;
using Action_Delay_API_Core.Models.Services;

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
            await using var result = await command.ExecuteReaderAsync(token);
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

        public async Task<List<QuickAnalyticsAPI>> GetQuickAnalytics(string type, string[] jobs, CancellationToken token = default)
        {
            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();

            command.AddParameter("jobNames" , "Array(String)", jobs);


            string datasetPrefix = "";
            string peakField = "run_length";
            string jobStatus = "Deployed";

            string quanRunLength = "quan_run_length";
            if (type.Equals("AI", StringComparison.OrdinalIgnoreCase))
            {
                quanRunLength = "quan_average_response_latency";
                datasetPrefix = "_ai";
                peakField = "average_response_latency";
                jobStatus = "Success";
            }
            else if (type.StartsWith("Perf", StringComparison.OrdinalIgnoreCase))
            {
                quanRunLength = "quan_average_response_latency";
                datasetPrefix = "_perf";
                peakField = "average_response_latency";
                jobStatus = "Success";

            }



            command.CommandText = $@"SELECT 
    'Last 1 Day' as period,
    medianMerge({quanRunLength}) as median_run_length,
    job_name
FROM 
    job_runs{datasetPrefix}_mv_30_mins
WHERE 
    job_name IN {{jobNames:Array(String)}} and
    average_time > now() - INTERVAL 1 DAY
Group by job_name

UNION ALL

SELECT 
    'Last 30 Days' as period,
    medianMerge({quanRunLength}) as median_run_length,
    job_name
FROM 
    job_runs{datasetPrefix}_mv_12_hours
WHERE 
    job_name IN {{jobNames:Array(String)}} and
     average_time > now() - INTERVAL 30 DAY
Group by job_name


UNION ALL

SELECT 
    'Last 90 Days' as period,
    medianMerge({quanRunLength}) as median_run_length,
    job_name
FROM 
    job_runs{datasetPrefix}_mv_12_hours
WHERE 
    job_name IN {{jobNames:Array(String)}} and
     average_time > now() - INTERVAL 90 DAY
Group by job_name

UNION ALL

 SELECT
    toString(run_time) AS period,
    toFloat64({peakField}) as median_run_length,
    job_name
FROM (
    SELECT
        job_name,
        run_time,
        {peakField},
        ROW_NUMBER() OVER (PARTITION BY job_name ORDER BY {peakField} DESC) AS rn
    FROM job_runs{datasetPrefix}
    WHERE job_name IN {{jobNames:Array(String)}}
        AND run_status = '{jobStatus}'
        AND run_time > now() - INTERVAL 1 DAY
)
WHERE rn = 1;
";

            await using var result = await command.ExecuteReaderAsync(token);
            List<QuickAnalyticsAPI> data = new List<QuickAnalyticsAPI>(3 * jobs.Length);
            while (await result.ReadAsync(token))
            {
                data.Add(new QuickAnalyticsAPI()
                {
                    Period = result["period"].ToString(),
                    MedianRunLength = result["median_run_length"].ToString(),
                    JobName = result["job_name"].ToString()
                });
            }
            return data;
        }

    }
}
