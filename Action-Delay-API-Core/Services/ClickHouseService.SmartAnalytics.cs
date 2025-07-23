using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using ClickHouse.Client.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
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

        public async Task<NormalJobAnalytics> GetNormalJobAnalytics(string[] jobs, DateTime startTime, DateTime endTime, JobAnalyticsConfiguration config, int maxPoints = 100, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength, CancellationToken token = default)
        {
            var output = PickRightDataSet(startTime, endTime, maxPoints);
            bool agg = output.Agg;
            string dataSetName = "";
            if (output.Dataset == DataSet.Minutely)
                dataSetName = config.NormalDataSet;
            else if (output.Dataset == DataSet.Per30Minutes)
                dataSetName = config.ThirtyMinDataSet;
            else if (output.Dataset == DataSet.Per12Hours)
                dataSetName = config.TwelthHourDataSet;



            var columns = ReturnOptionsColumns(agg, config, option);

            if (columns.Any() == false)
            {
                return new NormalJobAnalytics()
                {
                    Points = new List<NormalJobAnalyticsPoint>(),
                    GroupByMinutesInterval = output.Interval,
                };
            }

            string commandText = "";
            if (agg == false)
                commandText =
                    $"SELECT {String.Join(",", columns)}, toStartOfInterval(run_time, INTERVAL {output.Interval} MINUTES) as time_period FROM \"default\".\"{dataSetName}\" WHERE run_time > {{startDateTime:DateTime}} and  run_time < {{endDateTime:DateTime}} and job_name in {{jobs:Array(String)}} and run_status = '{config.NormalDataSetRunStatusFilter}' Group by time_period ORDER BY time_period";
            else commandText =
                $"SELECT {String.Join(",", columns)}, toStartOfInterval(average_time, INTERVAL {output.Interval} MINUTES) as time_period FROM \"default\".\"{dataSetName}\" WHERE average_time > {{startDateTime:DateTime}} and  average_time < {{endDateTime:DateTime}} and job_name in {{jobs:Array(String)}} Group by time_period ORDER BY time_period";


            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();
            command.AddParameter("startDateTime", "DateTime", startTime);
            command.AddParameter("endDateTime", "DateTime", endTime);
            command.AddParameter("jobs", "Array(String)", jobs);

            command.CommandText = commandText;
            await using var result = await command.ExecuteReaderAsync(token);
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

        public async Task<ErrorJobAnalytics> GetJobErrorAnalytics(string[] jobs, DateTime startTime, DateTime endTime, JobAnalyticsConfiguration config, int maxPoints = 100, CancellationToken token = default)
        {
            var output = PickRightDataSet(startTime, endTime, maxPoints);
            bool agg = output.Agg;
            string dataSetName = "";
            if (output.Dataset == DataSet.Minutely)
                dataSetName = config.NormalDataSet;
            else if (output.Dataset == DataSet.Per30Minutes)
                dataSetName = config.ThirtyMinDataSet;
            else if (output.Dataset == DataSet.Per12Hours)
                dataSetName = config.TwelthHourDataSet;




            string commandText = "";
            if (agg == false)
                commandText =
                    $"SELECT job_name, error_hash, toStartOfInterval(run_time, INTERVAL {output.Interval} MINUTES) as time_period, count() AS \"failures\" FROM \"default\".\"{dataSetName}\" WHERE run_time > {{startDateTime:DateTime}} and  run_time < {{endDateTime:DateTime}} and job_name in {{jobs:Array(String)}} Group by time_period, job_name, error_hash ORDER BY time_period";
            else commandText =
                $"SELECT job_name, error_hash, toStartOfInterval(average_time, INTERVAL {output.Interval} MINUTES) as time_period, countMerge(error_count) AS \"failures\" FROM \"default\".\"{dataSetName}\" WHERE average_time > {{startDateTime:DateTime}} and  average_time < {{endDateTime:DateTime}} and job_name in {{jobs:Array(String)}} Group by time_period, job_name, error_hash ORDER BY time_period";


            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();
            command.AddParameter("startDateTime", "DateTime", startTime);
            command.AddParameter("endDateTime", "DateTime", endTime);
            command.AddParameter("jobs", "Array(String)", jobs);

            command.CommandText = commandText;
            await using var result = await command.ExecuteReaderAsync(token);
            var predictedPoints = (int)Math.Ceiling((endTime - startTime).TotalMinutes / output.Interval);
            List<ErrorJobAnalyticsPoint> data = new List<ErrorJobAnalyticsPoint>(predictedPoints);
            while (await result.ReadAsync(token))
            {
                data.Add(GetErrorAnalyticsReader(result, false));
            }
            return new ErrorJobAnalytics()
            {
                Points = data,
                GroupByMinutesInterval = output.Interval,
            };
        }

        private ErrorJobAnalyticsPoint GetErrorAnalyticsReader(DbDataReader reader, bool locationName)
        {
            var newAnalyticsObj = new ErrorJobAnalyticsPoint();
            newAnalyticsObj.TimePeriod = reader.GetDateTime("time_period");
            newAnalyticsObj.JobName = reader.GetString("job_name");
            newAnalyticsObj.ErrorHash = reader.GetString("error_hash");
            newAnalyticsObj.Count = Convert.ToUInt64(reader.GetValue("failures"));

            return newAnalyticsObj;
        }


        public async Task<NormalJobAnalytics> GetNormalJobLocationAnalytics(string[] jobs, string[] locations, DateTime startTime, DateTime endTime,JobAnalyticsConfiguration config, int maxPoints = 100, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength, CancellationToken token = default)
        {
            var output = PickRightDataSet(startTime, endTime, maxPoints);
            bool agg = output.Agg;
            string dataSetName = "";
            if (output.Dataset == DataSet.Minutely)
                dataSetName = config.NormalDataSet;
            else if (output.Dataset == DataSet.Per30Minutes)
                dataSetName = config.ThirtyMinDataSet;
            else if (output.Dataset == DataSet.Per12Hours)
                dataSetName = config.TwelthHourDataSet;



            var columns = ReturnOptionsColumns(agg, config, option);

            string commandText = "";
            if (agg == false)
                commandText =
                    $"SELECT {String.Join(",", columns)}, toStartOfInterval(run_time, INTERVAL {output.Interval} MINUTES) as time_period FROM \"default\".\"{dataSetName}\" WHERE run_time > {{startDateTime:DateTime}} and  run_time < {{endDateTime:DateTime}} and job_name in {{jobs:Array(String)}} and run_status = 'Deployed' and location_name in {{locations:Array(String)}}  Group by time_period  ORDER BY time_period";
            else commandText =
                $"SELECT {String.Join(",", columns)}, toStartOfInterval(average_time, INTERVAL {output.Interval} MINUTES) as time_period  FROM \"default\".\"{dataSetName}\" WHERE average_time > {{startDateTime:DateTime}} and  average_time < {{endDateTime:DateTime}} and job_name in {{jobs:Array(String)}} and location_name in {{locations:Array(String)}} Group by time_period  ORDER BY time_period";


            await using var connection = CreateConnection();

            await using var command = connection.CreateCommand();
            command.AddParameter("startDateTime", "DateTime", startTime);
            command.AddParameter("endDateTime", "DateTime", endTime);
            command.AddParameter("jobs", "Array(String)", jobs);
            command.AddParameter("locations", "Array(String)", locations);




            command.CommandText = commandText;

            await using var result = await command.ExecuteReaderAsync(token);
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

        private List<string> ReturnOptionsColumns(bool agg, JobAnalyticsConfiguration config, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength)
        {
            List<string> columns = new List<string>();

            Dictionary<JobAnalyticsRequestOptions, string> columnNameDict = null;
            if (agg)
                columnNameDict = config.ColumnNamesAgg;
            else 
                columnNameDict = config.ColumnNames;


            if (option.HasFlag(JobAnalyticsRequestOptions.MinRunLength) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.MinRunLength, out var colNameMinRunLength))
                columns.Add(agg ? $"minMerge({colNameMinRunLength}) as min_run_length" : $"min({colNameMinRunLength}) as min_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.MaxRunLength) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.MaxRunLength, out var colNameMaxRunLength))
                columns.Add(agg ? $"maxMerge({colNameMaxRunLength}) as max_run_length" : $"max({colNameMaxRunLength}) as max_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.AvgRunLength) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.AvgRunLength, out var colNameAvgRunLength))
                columns.Add(agg ? $"avgMerge({colNameAvgRunLength}) as avg_run_length" : $"avg({colNameAvgRunLength}) as avg_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.MedianRunLength) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.MedianRunLength, out var colNameMedianRunLength))
                columns.Add(agg ? $"medianMerge({colNameMedianRunLength}) as median_run_length" : $"median({colNameMedianRunLength}) as median_run_length");

            if (option.HasFlag(JobAnalyticsRequestOptions.MinResponseLatency) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.MinResponseLatency, out var colNameMinResponseLatency))
                columns.Add(agg ? $"minMerge({colNameMinResponseLatency}) as min_response_latency" : $"min({colNameMinResponseLatency}) as min_response_latency");

            if (option.HasFlag(JobAnalyticsRequestOptions.MaxResponseLatency) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.MaxResponseLatency, out var colNameMaxResponseLatency))
                columns.Add(agg ? $"maxMerge({colNameMaxResponseLatency}) as max_response_latency" : $"max({colNameMaxResponseLatency}) as max_response_latency");

            if (option.HasFlag(JobAnalyticsRequestOptions.AvgResponseLatency) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.AvgResponseLatency, out var colNameAvgResponseLatency))
                columns.Add(agg ? $"avgMerge({colNameAvgResponseLatency}) as avg_response_latency" : $"avg({colNameAvgResponseLatency}) as avg_response_latency");

            if (option.HasFlag(JobAnalyticsRequestOptions.MedianResponseLatency) && columnNameDict.TryGetValue(JobAnalyticsRequestOptions.MedianResponseLatency, out var colNameMedianResponseLatencyValue))
                columns.Add(agg ? $"medianMerge({colNameMedianResponseLatencyValue}) as median_response_latency" : $"median({colNameMedianResponseLatencyValue}) as median_response_latency");
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
