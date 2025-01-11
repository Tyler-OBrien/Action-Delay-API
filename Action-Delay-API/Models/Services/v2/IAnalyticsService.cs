using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using FluentResults;

namespace Action_Delay_API.Models.Services.v2
{
    public interface IAnalyticsService
    {

        Task<Result<DataResponse<NormalJobAnalyticsDTO>>> GetJobAnalytics(string jobName, DateTime startDateTime,
            DateTime endDateTime, JobAnalyticsRequestOptions options, CancellationToken token, int maxPoints = 100);

        Task<Result<DataResponse<NormalJobLocationAnalyticsDTO>>> GetJobAnalyticsLocation(string jobName,
            string locationName, DateTime startDateTime, DateTime endDateTime, JobAnalyticsRequestOptions options,
            CancellationToken token, int maxPoints = 100);

        Task<Result<DataResponse<NormalJobLocationAnalyticsDTO>>> GetJobAnalyticsLocationRegion(string[] jobName,
            string regionName, DateTime startDateTime, DateTime endDateTime, JobAnalyticsRequestOptions options,
            CancellationToken token, int maxPoints = 100);

        Task<Result<DataResponse<ErrorJobAnalyticsDTO>>> GetErrorAnalyticsForJob(string jobName,
            DateTime startDateTime, DateTime endDateTime, CancellationToken token, int maxPoints = 100);

        Task<Result<DataResponse<NormalJobAnalyticsDTO>>> GetJobAnalyticsByType(string jobType, DateTime startDateTime,
            DateTime endDateTime, JobAnalyticsRequestOptions options, CancellationToken token, int maxPoints = 100);


        Task<Result<DataResponse<ErrorJobAnalyticsDTO>>> GetErrorAnalyticsForJobType(string jobType,
            DateTime startDateTime, DateTime endDateTime, CancellationToken token, int maxPoints = 100);


    }
}
