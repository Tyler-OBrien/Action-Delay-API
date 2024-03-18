namespace Action_Delay_API.Models.Services.v2
{
    public interface ICacheSingletonService
    {
        public void CacheJobNames(IEnumerable<string> jobName);

        public Task<HashSet<string>> GetJobNames(CancellationToken token);
        public void CacheLocationNames(IEnumerable<string> locationNames);

        public  Task<HashSet<string>> GetLocationNames(CancellationToken token);

        public Task<bool> DoesJobExist(string jobName, CancellationToken token);
        public Task<bool> DoesLocationExist(string locationName, CancellationToken token);
    }
}
