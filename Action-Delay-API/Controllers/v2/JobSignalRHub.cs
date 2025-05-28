using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.SignalR;

namespace Action_Delay_API.Controllers.v2;

public class JobSignalRHub : Hub
{
    private readonly ICacheSingletonService _cacheSingletonService;
    public JobSignalRHub(ICacheSingletonService cacheSingletonService)
    {
        _cacheSingletonService = cacheSingletonService;
    }

    public async Task SubscribeToAllJobs()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "all_jobs", CancellationToken.None);
    }

    public async Task SubscribeToJob(string jobName)
    {
        var tryGetInternalJobName = await _cacheSingletonService.GetInternalJobName(jobName, CancellationToken.None);
        if (tryGetInternalJobName != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"job_{tryGetInternalJobName}", CancellationToken.None);
    }
    public async Task UnsubscribeToJob(string jobName)
    {
        var tryGetInternalJobName = await _cacheSingletonService.GetInternalJobName(jobName, CancellationToken.None);
        if (tryGetInternalJobName != null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"job_{tryGetInternalJobName}", CancellationToken.None);
    }

    public async Task SubscribeToType(string typeName)
    {
        var tryGetInternalJobName = await _cacheSingletonService.ResolveJobType(typeName, CancellationToken.None);
        if (String.IsNullOrWhiteSpace(tryGetInternalJobName) == false)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"type_{tryGetInternalJobName}", CancellationToken.None);
    }
}
