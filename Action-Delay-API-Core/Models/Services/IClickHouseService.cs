using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Clickhouse;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IClickHouseService
    {
        Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, ClickhouseAPIError? apiError,
            CancellationToken token = default);

        Task<List<DeploymentStatistic>> GetCompatibleDeploymentStatistics(CancellationToken token = default);
    }
}
