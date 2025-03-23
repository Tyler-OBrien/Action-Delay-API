using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Errors;
using System.Xml.Linq;
using System.Text.Json.Serialization;
using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.Services.v2;
using System.Text.Json.Nodes;

namespace Action_Delay_API.Services.v2
{
    

    public class ExternalJobService : IExternalJobService
    {
        private readonly ActionDelayDatabaseContext _genericServersContext;
        private readonly IClickHouseService _clickHouseService;

        private readonly ILogger _logger;

        public ExternalJobService(ActionDelayDatabaseContext genericServersContext, ILogger<ExternalJobService> logger, IClickHouseService clickhouseService)
        {
            _clickHouseService = clickhouseService;
            _genericServersContext = genericServersContext;
            _logger = logger;
        }

        public async Task<Result<DataResponse<bool>>> IngestGenericMetric(GenericDataIngestDTO jobRequest, 
            CancellationToken token)
        {
            try
            {
                foreach (var dataByType in jobRequest.Data.GroupBy(data => data.InputType))
                {
                    // Process each group of data points with the same input type
                    var processedData = ProcessDataGroup(dataByType);

                    await _clickHouseService.InsertGeneric(
                        processedData.DataRows,
                        processedData.ColumnNames,
                        dataByType.Key,
                        token
                    );

                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting run failure for error cause: {errorCause}",  ex.Message);

                return Result.Fail(new ErrorResponse(500,
                    "Internal Error on inserting into Clickhouse", "internal_error"));
            }
            return new DataResponse<bool>(true);
        }


        public (List<object[]> DataRows, string[] ColumnNames) ProcessDataGroup(IGrouping<string, GenericDataPoint> dataGroup)
        {
            var dataRows = new List<object[]>();
            string[] columnNames = null;

            foreach (var dataPoint in dataGroup)
            {
                // Ensure the data is a JsonObject
                if (dataPoint.Data is not JsonObject jsonObject)
                {
                    _logger.LogWarning($"Skipping non-object data for type {dataPoint.InputType}");
                    continue;
                }

                // Extract column names (lowercase) on the first iteration
                if (columnNames == null)
                {
                    columnNames = jsonObject.Select(p => p.Key).ToArray();
                }

                // Extract values, preserving their original types
                var rowValues = new object[columnNames.Length];
                for (int i = 0; i < columnNames.Length; i++)
                {
                    var propertyName = columnNames[i];
                    var jsonValue = jsonObject[propertyName];

                    rowValues[i] = ConvertJsonNodeToValue(jsonValue);
                }

                dataRows.Add(rowValues);
            }

            return (dataRows, columnNames);
        }

        private static readonly string[] DateTimeFormats = new[]
        {
            "yyyy-MM-ddTHH:mm:ssZ",     // ISO 8601 UTC 
            "yyyy-MM-ddTHH:mm:ss.FFFZ",  // ISO 8601 with milliseconds
            "o",  // Round-trip date/time pattern
            "yyyy-MM-dd'T'HH:mm:sszzz",   // ISO 8601 with timezone
        };
        private object TryParseDatetime(string strValue)
        {
            if (DateTime.TryParseExact(strValue, DateTimeFormats,
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.AdjustToUniversal,
                    out DateTime parsedDateTime))
            {
                return parsedDateTime;
            }
            return null;
        }


        public object ConvertJsonNodeToValue(JsonNode jsonValue)
        {
            if (jsonValue == null) return DBNull.Value;

            return jsonValue switch
            {
                JsonValue jv when jv.TryGetValue<string>(out var strValue) =>
                    TryParseDatetime(strValue) ?? strValue,
                JsonValue jv when jv.TryGetValue<long>(out var longValue) => longValue,
                JsonValue jv when jv.TryGetValue<double>(out var doubleValue) => doubleValue,
                JsonValue jv when jv.TryGetValue<bool>(out var boolValue) => boolValue,
                JsonArray ja => ja.Select(ConvertJsonNodeToValue).ToArray(),
                JsonObject jo => jo, 
                _ => jsonValue.ToString()
            };
        }


        public async Task<Result<DataResponse<bool>>> SendJobResult(JobResultRequestDTO jobRequest, int coloId, CancellationToken token)
        {

            if (String.IsNullOrWhiteSpace(jobRequest.InternalJobName))
            {
                return Result.Fail($"Job Internal Name cannot be null");
            }

            if (String.IsNullOrWhiteSpace(jobRequest.JobName))
            {
                return Result.Fail($"Job Name cannot be null");

            }

            var tryGetJob = await _genericServersContext.JobData.FirstOrDefaultAsync(job => job.InternalJobName == jobRequest.InternalJobName, token);
            if (tryGetJob == null)
            {
                tryGetJob = new JobData();
                tryGetJob.InternalJobName = jobRequest.InternalJobName;
                tryGetJob.JobName = jobRequest.JobName;
                tryGetJob.JobDescription = string.Empty;
                tryGetJob.JobType = string.Empty;
                _genericServersContext.JobData.Add(tryGetJob);
            }
            else
            {
                tryGetJob.LastRunStatus = tryGetJob.CurrentRunStatus;
                tryGetJob.LastRunLengthMs = tryGetJob.CurrentRunLengthMs;
                tryGetJob.LastRunTime = tryGetJob.CurrentRunTime;

                if (jobRequest.CalculateRunLengthFromLastTime)
                {
                    var getRunLength = (jobRequest.RunTime - tryGetJob.LastRunTime.Value).TotalMilliseconds;
                    if (getRunLength > 0)
                        jobRequest.RunLengthMs = (ulong)getRunLength;
                }
            }

            if (jobRequest.CalculateColoIdFromRequestHeader)
            {
                jobRequest.ColoId = coloId;
            }

            tryGetJob.CurrentRunLengthMs = jobRequest.RunLengthMs;
            tryGetJob.CurrentRunStatus = jobRequest.RunStatus;
            tryGetJob.CurrentRunTime = jobRequest.RunTime;

            try
            {
                await _clickHouseService.InsertRun(
                    new ClickhouseJobRun()
                    {
                        JobName = jobRequest.InternalJobName,
                        RunStatus = jobRequest.RunStatus,
                        RunLength = jobRequest.RunLengthMs,
                        RunTime = jobRequest.RunTime,
                        ResponseLatency = jobRequest.APIResponseLatency ?? 0,
                    }, new List<ClickhouseJobLocationRun>(), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{jobName}: Error inserting run failure for error cause: {errorCause}", jobRequest.JobName, ex.Message);

                return Result.Fail(new ErrorResponse(500,
                    "Internal Error on inserting into Clickhouse", "internal_error"));
            }
            try
            {
                await _genericServersContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving run status for {jobName}", jobRequest.JobName);
                return Result.Fail(new ErrorResponse(500,
                    "Internal Error on inserting into database", "internal_error"));
            }

            return new DataResponse<bool>(true);
        }

    }
}
