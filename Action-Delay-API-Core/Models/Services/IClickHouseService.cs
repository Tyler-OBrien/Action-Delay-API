using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IClickHouseService
    {
        Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun> locations,
            CancellationToken token = default);

        Task<List<DeploymentStatistic>> GetCompatibleDeploymentStatistics(CancellationToken token = default);
    }
}
