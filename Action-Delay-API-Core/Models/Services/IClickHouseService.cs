using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.API.Quick;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Services.ClickHouse;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IClickHouseService
    {
        Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, ClickhouseAPIError? apiError,
            CancellationToken token = default);

        Task InsertRunAI(List<ClickhouseJobRun> run, List<ClickhouseJobLocationRun>? locations,
            List<ClickhouseAPIError>? apiError = null, CancellationToken token = default);


        Task<List<DeploymentStatistic>> GetCompatibleDeploymentStatistics(CancellationToken token = default);

        Task<List<QuickAnalyticsAPI>> GetQuickAnalytics(string jobName, CancellationToken token = default);

        Task<NormalJobAnalytics> GetNormalJobAnalytics(string jobName, DateTime startTime, DateTime endTime,
            int maxPoints = 100, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength,
            CancellationToken token = default);

         Task<NormalJobAnalytics> GetNormalJobLocationAnalytics(string jobName, string locationName,
             DateTime startTime, DateTime endTime, int maxPoints = 100,
             JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength,
             CancellationToken token = default);

    }
}
