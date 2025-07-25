﻿using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.API.Quick;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Services.ClickHouse;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IClickHouseService
    {
        public  Task InsertGeneric(List<object[]> data, string[] columns, string table,
            CancellationToken token = default);
        Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, ClickhouseAPIError? apiError,
            CancellationToken token = default);

        Task InsertRunAI(List<ClickhouseJobRun> run, List<ClickhouseJobLocationRun>? locations,
            List<ClickhouseAPIError>? apiError = null, CancellationToken token = default);

        Task InsertRunPerf(List<ClickhouseJobRunPerf> runs, List<ClickhouseJobLocationRunPerf>? locations,
            List<ClickhouseAPIErrorPerf>? apiError = null, CancellationToken token = default);


        Task<List<DeploymentStatistic>> GetCompatibleDeploymentStatistics(CancellationToken token = default);

        Task<List<QuickAnalyticsAPI>> GetQuickAnalytics(string jobName, CancellationToken token = default);

        Task<List<QuickAnalyticsAPI>> GetQuickAnalytics(string type, string[] jobs, CancellationToken token = default);

        Task<NormalJobAnalytics> GetNormalJobAnalytics(string[] jobName, DateTime startTime, DateTime endTime, JobAnalyticsConfiguration config,
            int maxPoints = 100, JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength,
            CancellationToken token = default);

        Task<ErrorJobAnalytics> GetJobErrorAnalytics(string[] jobs, DateTime startTime, DateTime endTime,
            JobAnalyticsConfiguration config, int maxPoints = 100, CancellationToken token = default);


         Task<NormalJobAnalytics> GetNormalJobLocationAnalytics(string[] jobs, string[] locations,
             DateTime startTime, DateTime endTime, JobAnalyticsConfiguration config, int maxPoints = 100,
             JobAnalyticsRequestOptions option = JobAnalyticsRequestOptions.AvgRunLength,
             CancellationToken token = default);

         Task<OverallAnalytics> GetOverallAnalytics(CancellationToken token);


    }
}
