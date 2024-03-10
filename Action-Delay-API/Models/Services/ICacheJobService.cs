using FluentResults;

namespace Action_Delay_API.Models.Services
{
    public interface ICacheJobService
    {
        Task<Result<string>> GetCacheValue(CancellationToken token);
    }
}
