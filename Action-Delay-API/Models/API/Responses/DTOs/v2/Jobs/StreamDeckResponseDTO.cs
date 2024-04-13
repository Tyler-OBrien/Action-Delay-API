using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Database.Postgres;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Jobs;

public class StreamDeckResponseResponseExample : IExamplesProvider<DataResponse<StreamDeckResponseDTO>>
{
    public DataResponse<StreamDeckResponseDTO> GetExamples()
    {
        return new DataResponse<StreamDeckResponseDTO>(
            new StreamDeckResponseDTO
            {
                JobName = "DNS Delay Job",
                InternalJobName = "dns",
                PredictedText = "3.68s",
                PredictedRunTimeText = "36 Seconds ago",
                PredictedStatusText = "Deployed",
            }
        );
    }
}

public class StreamDeckResponseDTO
{
    [JsonPropertyName("jobName")]

    /// <summary>
    /// This field is the Friendly Name of the Job.
    /// </summary>
    public string JobName { get; set; }

    [JsonPropertyName("internalJobName")]

    /// <summary>
    /// This field is the internal Name of the Job. For use in api endpoints.
    /// </summary>
    public string InternalJobName { get; set; }

    [JsonPropertyName("predictedText")]

    /// <summary>
    /// This field is the internal Name of the Job. For use in api endpoints.
    /// </summary>
    public string PredictedText { get; set; }

    [JsonPropertyName("predictedTimeText")]
    /// <summary>
    /// This field is the internal Name of the Job. For use in api endpoints.
    /// </summary>
    public string PredictedRunTimeText { get; set; }


    [JsonPropertyName("predictedStatusText")]
    /// <summary>
    /// This field is the internal Name of the Job. For use in api endpoints.
    /// </summary>
    /// 
    public string PredictedStatusText { get; set; }

    public static string FormatDuration(ulong? ms)
    {
        if (ms == null) return string.Empty;
        TimeSpan time = TimeSpan.FromMilliseconds(ms.Value);
        if (time.TotalDays >= 1.0)
        {
            return $"{time.TotalDays:0.###}d";
        }
        else if (time.TotalHours >= 1.0)
        {
            return $"{time.TotalHours:0.###}h";
        }
        else if (time.TotalMinutes >= 1.0)
        {
            return $"{time.TotalMinutes:0.###}m";
        }
        else
        {
            return $"{time.TotalSeconds:0.###}s";
        }
    }

    //https://stackoverflow.com/questions/11/calculate-relative-time-in-c-sharp
    public static string FormatRelativeTime(DateTime? input)
    {
        if (input == null) return string.Empty;
        const int SECOND = 1;
        const int MINUTE = 60 * SECOND;
        const int HOUR = 60 * MINUTE;
        const int DAY = 24 * HOUR;
        const int MONTH = 30 * DAY;

        var ts = new TimeSpan(DateTime.UtcNow.Ticks - input.Value.Ticks);
        var delta = Math.Abs(ts.TotalSeconds);

        if (delta < 1 * MINUTE)
            return ts.Seconds == 1 ? "one second ago" : ts.Seconds + " seconds ago";

        if (delta < 2 * MINUTE)
            return "a minute ago";

        if (delta < 45 * MINUTE)
            return ts.Minutes + " minutes ago";

        if (delta < 90 * MINUTE)
            return "an hour ago";

        if (delta < 24 * HOUR)
            return ts.Hours + " hours ago";

        if (delta < 48 * HOUR)
            return "yesterday";

        if (delta < 30 * DAY)
            return ts.Days + " days ago";

        if (delta < 12 * MONTH)
        {
            var months = Convert.ToInt32(Math.Floor((double)ts.Days / 30));
            return months <= 1 ? "one month ago" : months + " months ago";
        }

        var years = Convert.ToInt32(Math.Floor((double)ts.Days / 365));
        return years <= 1 ? "one year ago" : years + " years ago";
    }


    public static StreamDeckResponseDTO FromJobData(JobData data)
    {
        var newJobDataResponse = new StreamDeckResponseDTO();
        newJobDataResponse.InternalJobName = data.InternalJobName;
        newJobDataResponse.JobName = data.JobName;
        if (data?.CurrentRunStatus?.Equals(Status.STATUS_DEPLOYED, StringComparison.OrdinalIgnoreCase) ?? false)
        {
            newJobDataResponse.PredictedText = FormatDuration(data.CurrentRunLengthMs);
            newJobDataResponse.PredictedRunTimeText = FormatRelativeTime(data.CurrentRunTime);
            newJobDataResponse.PredictedStatusText = data.CurrentRunStatus ?? string.Empty;
        }
        else if ((data?.CurrentRunStatus?.Equals(Status.STATUS_UNDEPLOYED, StringComparison.OrdinalIgnoreCase) ??
                  false) && data.CurrentRunLengthMs > 5000)
        {
            newJobDataResponse.PredictedText = FormatDuration(data.CurrentRunLengthMs);
            newJobDataResponse.PredictedRunTimeText = FormatRelativeTime(data.CurrentRunTime);
            newJobDataResponse.PredictedStatusText = data.CurrentRunStatus ?? string.Empty;
        }
        else
        {
            newJobDataResponse.PredictedText = FormatDuration(data.LastRunLengthMs);
            newJobDataResponse.PredictedRunTimeText = FormatRelativeTime(data.LastRunTime);
            newJobDataResponse.PredictedStatusText = data.LastRunStatus ?? string.Empty;
        }

        return newJobDataResponse;
    }
}