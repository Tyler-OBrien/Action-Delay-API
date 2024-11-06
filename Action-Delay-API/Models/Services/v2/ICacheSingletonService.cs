using Action_Delay_API_Core.Models.Database.Postgres;

namespace Action_Delay_API.Models.Services.v2
{
    public interface ICacheSingletonService
    {
        public void CacheJobNames(List<JobData> jobs);

        public void CacheLocationNames(IEnumerable<string> locationNames);

        public ValueTask<string?> GetInternalJobName(string jobName, CancellationToken token);

        public ValueTask<bool> DoesLocationExist(string locationName, CancellationToken token);

        public ValueTask<string?> GetJobTypeFromName(string jobName, CancellationToken token);


        public ValueTask<string> GetJobType(string jobType, CancellationToken token);

        public ValueTask<string[]> GetJobsByType(string jobType, CancellationToken token);


    }
}
