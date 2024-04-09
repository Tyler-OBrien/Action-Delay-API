using Action_Delay_API.Controllers;
using Action_Delay_API.Models.Services;
using Action_Delay_API_Core.Models.Database.Postgres;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services
{
    public class CacheJobService : ICacheJobService
    {
        private readonly ActionDelayDatabaseContext _genericServersContext;

        private readonly ILogger _logger;

        public CacheJobService(ActionDelayDatabaseContext genericServersContext, ILogger<CacheJobService> logger)
        {
            _genericServersContext = genericServersContext;
            _logger = logger;
        }
        public async Task<Result<string>> GetCacheValue(CancellationToken token)
        {
            return (await _genericServersContext.GenericJobData.AsNoTracking()
                .FirstOrDefaultAsync(jobData => jobData.JobName == "purge",
                    cancellationToken: token))?.Value ?? "";
        }

    }
}
