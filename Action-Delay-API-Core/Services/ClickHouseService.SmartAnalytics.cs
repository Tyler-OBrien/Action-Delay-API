using Action_Delay_API_Core.Models.API.CompatAPI;
using ClickHouse.Client.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using DataSet = Action_Delay_API_Core.Models.Services.ClickHouse.DataSet;

namespace Action_Delay_API_Core.Services
{
  
 
    public partial class ClickHouseService
    {
        public const int MINUTES_IN_AN_HOUR = 60;
        public const int HOURS_IN_A_DAY = 24;

        // chosen to try to logically pick the closest count, for example doing every 5 hours doesn't make sense for someone reading, 6 hours does. 
        public static readonly IntervalDataSet[] PreDefinedIntervals = new[]
        {
            new IntervalDataSet { Interval = 1, DataSet = DataSet.Minutely},
            new IntervalDataSet { Interval = 2, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 5, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 10, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 15, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 30, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 45, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 60, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 2 * MINUTES_IN_AN_HOUR, DataSet = DataSet.Minutely },
            new IntervalDataSet { Interval = 4 * MINUTES_IN_AN_HOUR, DataSet = DataSet.Per30Minutes, Agg = true},
            new IntervalDataSet { Interval = 6 * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per30Minutes, Agg = true },
            new IntervalDataSet { Interval = 12 * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per30Minutes, Agg = true },
            new IntervalDataSet { Interval = HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR, DataSet = DataSet.Per12Hours, Agg = true },
            new IntervalDataSet { Interval = 3 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per12Hours, Agg = true },
            new IntervalDataSet { Interval = 7 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per12Hours, Agg = true },
            new IntervalDataSet { Interval = 14 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per12Hours, Agg = true },
            new IntervalDataSet { Interval = 21 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per12Hours, Agg = true },
            new IntervalDataSet { Interval = 28 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per12Hours, Agg = true },
            new IntervalDataSet { Interval = 30 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR,  DataSet = DataSet.Per12Hours, Agg = true },
        };

        static IntervalToUse PickRightDataSet(DateTime startDateTime, DateTime endDateTime, int maxPoints)
        {
            TimeSpan totalTime = endDateTime - startDateTime;

            IntervalDataSet dataSetInfo = PreDefinedIntervals.Last();
            foreach (var intervalDataSet in PreDefinedIntervals)
            {
                var estimatedPoints = totalTime.TotalMinutes / intervalDataSet.Interval;
                if (estimatedPoints <= maxPoints)
                {
                    dataSetInfo = intervalDataSet;
                    break;
                }
            }

            return new IntervalToUse(dataSetInfo.DataSet, dataSetInfo.Interval, dataSetInfo.Agg);
        }

        public async Task<NormalJobAnalytics> GetNormalJobAnalytics(string jobName, DateTime startTime, DateTime endTime, int maxPoints = 100, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength, CancellationToken token = default)
        {
            var output = PickRightDataSet(startTime, endTime, maxPoints);
            bool agg = output.Agg;
            string dataSetName = "";
            if (output.Dataset == DataSet.Minutely)
                dataSetName = "job_runs";
            else if (output.Dataset == DataSet.Per30Minutes)
                dataSetName = "job_runs_mv_30_mins";
            else if (output.Dataset == DataSet.Per12Hours)
                dataSetName = "job_runs_mv_12_hours";



            var columns = ReturnOptionsColumns(agg, option);

            string commandText = "";
            if (agg == false)
                commandText =
                    $"SELECT {String.Join(",", columns)}, toStartOfInterval(run_time, INTERVAL {output.Interval} MINUTES) as time_period FROM \"default\".\"{dataSetName}\" WHERE run_time > {{startDateTime:DateTime}} and  run_time < {{endDateTime:DateTime}} and job_name = {{jobName:String}} and run_status = 'Deployed' Group by time_period ORDER BY time_period";
            else commandText =
                $"SELECT {String.Join(",", columns)}, toStartOfInterval(average_time, INTERVAL {output.Interval} MINUTES) as time_period FROM \"default\".\"{dataSetName}\" WHERE average_time > {{startDateTime:DateTime}} and  average_time < {{endDateTime:DateTime}} and job_name = {{jobName:String}} Group by time_period ORDER BY time_period";


            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();
            command.AddParameter("startDateTime", "DateTime", startTime);
            command.AddParameter("endDateTime", "DateTime", endTime);
            command.AddParameter("jobName", "String", jobName);

            command.CommandText = commandText;
            var result = await command.ExecuteReaderAsync(token);
            var predictedPoints = (int)Math.Ceiling((endTime - startTime).TotalMinutes / output.Interval);
            List<NormalJobAnalyticsPoint> data = new List<NormalJobAnalyticsPoint>(predictedPoints);
            while (await result.ReadAsync(token))
            {
                data.Add(NormalJobAnalyticsFromReader(result, option, false));
            }
            return new NormalJobAnalytics()
            {
                Points = data,
                GroupByMinutesInterval = output.Interval,
            };
        }

        public async Task<NormalJobAnalytics> GetNormalJobLocationAnalytics(string jobName, string locationName, DateTime startTime, DateTime endTime, int maxPoints = 100, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength, CancellationToken token = default)
        {
            var output = PickRightDataSet(startTime, endTime, maxPoints);
            bool agg = output.Agg;
            string dataSetName = "";
            if (output.Dataset == DataSet.Minutely)
                dataSetName = "job_runs";
            else if (output.Dataset == DataSet.Per30Minutes)
                dataSetName = "job_runs_mv_30_mins";
            else if (output.Dataset == DataSet.Per12Hours)
                dataSetName = "job_runs_mv_12_hours";



            var columns = ReturnOptionsColumns(agg, option);

            string commandText = "";
            if (agg == false)
                commandText =
                    $"SELECT {String.Join(",", columns)}, toStartOfInterval(run_time, INTERVAL {output.Interval} MINUTES) as time_period FROM \"default\".\"{dataSetName}\" WHERE run_time > {{startDateTime:DateTime}} and  run_time < {{endDateTime:DateTime}} and job_name = {{jobName:String}} and run_status = 'Deployed' and location_name = {{locationName:String}} Group by time_period  ORDER BY time_period";
            else commandText =
                $"SELECT {String.Join(",", columns)}, toStartOfInterval(average_time, INTERVAL {output.Interval} MINUTES) as time_period  FROM \"default\".\"{dataSetName}\" WHERE average_time > {{startDateTime:DateTime}} and  average_time < {{endDateTime:DateTime}} and job_name = {{jobName:String}} and location_name = {{locationName:String}}  Group by time_period  ORDER BY time_period";


            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();
            command.AddParameter("startDateTime", "DateTime", startTime);
            command.AddParameter("endDateTime", "DateTime", endTime);
            command.AddParameter("jobName", "String", jobName);

            command.CommandText = commandText;
            var result = await command.ExecuteReaderAsync(token);
            var predictedPoints = (int)Math.Ceiling((endTime - startTime).TotalMinutes / output.Interval);
            List<NormalJobAnalyticsPoint> data = new List<NormalJobAnalyticsPoint>(predictedPoints);
            while (await result.ReadAsync(token))
            {
                data.Add(NormalJobAnalyticsFromReader(result, option, true));
            }

            return new NormalJobAnalytics()
            {
                Points = data,
                GroupByMinutesInterval = output.Interval,
            };
        }

        private List<string> ReturnOptionsColumns(bool agg, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength)
        {
            List<string> columns = new List<string>();

            if (option.HasFlag(JobAnalyticsRequestOptions.MinRunLength))
                columns.Add(agg ? "minMerge(min_run_length) as min_run_length" : "min(run_length) as min_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.MaxRunLength))
                columns.Add(agg ? "maxMerge(max_run_length) as max_run_length" : "max(run_length) as max_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.AvgRunLength))
                columns.Add(agg ? "avgMerge(avg_run_length) as avg_run_length" : "avg(run_length) as avg_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.MedianRunLength))
                columns.Add(agg ? "medianMerge(median_run_length) as median_run_length" : "median(run_length) as median_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.MinResponseLatency))
                columns.Add(agg ? "minMerge(min_response_latency) as min_response_latency" : "min(response_latency) as min_response_latency");

            if (option.HasFlag(JobAnalyticsRequestOptions.MaxResponseLatency))
                columns.Add(agg ? "maxMerge(max_response_latency) as max_response_latency" : "max(response_latency) as max_response_latency");

            if (option.HasFlag(JobAnalyticsRequestOptions.AvgResponseLatency))
                columns.Add(agg ? "avgMerge(avg_response_latency) as avg_response_latency" : "avg(response_latency) as avg_response_latency");

            if (option.HasFlag(JobAnalyticsRequestOptions.MedianResponseLatency))
                columns.Add(agg ? "medianMerge(median_response_latency) as median_response_latency" : "median(response_latency) as median_response_latency");
            return columns;
        }

        private NormalJobAnalyticsPoint NormalJobAnalyticsFromReader(DbDataReader reader, JobAnalyticsRequestOptions option, bool locationName)
        {
            var newAnalyticsObj = new NormalJobAnalyticsPoint();
            newAnalyticsObj.TimePeriod = reader.GetDateTime("time_period");
                

            if (option.HasFlag(JobAnalyticsRequestOptions.MinRunLength))
                newAnalyticsObj.MinRunLength = Convert.ToUInt64(reader.GetValue("min_run_length"));

            if (option.HasFlag(JobAnalyticsRequestOptions.MaxRunLength))
                newAnalyticsObj.MaxRunLength = Convert.ToUInt64(reader.GetValue("max_run_length"));

            if (option.HasFlag(JobAnalyticsRequestOptions.AvgRunLength))
                newAnalyticsObj.AvgRunLength = Convert.ToUInt64(reader.GetValue("avg_run_length"));


            if (option.HasFlag(JobAnalyticsRequestOptions.MedianRunLength)) 
                newAnalyticsObj.MedianRunLength = Convert.ToUInt64(reader.GetValue("median_run_length"));


            if (option.HasFlag(JobAnalyticsRequestOptions.MinResponseLatency)) 
                newAnalyticsObj.MinResponseLatency = Convert.ToUInt64(reader.GetValue("min_response_latency"));

            if (option.HasFlag(JobAnalyticsRequestOptions.MaxResponseLatency))
                newAnalyticsObj.MaxResponseLatency = Convert.ToUInt64(reader.GetValue("max_response_latency"));

            if (option.HasFlag(JobAnalyticsRequestOptions.AvgResponseLatency))
                newAnalyticsObj.AvgResponseLatency = Convert.ToUInt64(reader.GetValue("avg_response_latency"));

            if (option.HasFlag(JobAnalyticsRequestOptions.MedianResponseLatency))
                newAnalyticsObj.MedianResponseLatency = Convert.ToUInt64(reader.GetValue("median_response_latency"));
            return newAnalyticsObj;
        }
   
    }
}
