using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services.v2;

public class JobDataService : IJobDataService
{
    private readonly ICacheSingletonService _cacheSingletonService;
    private readonly ActionDelayDatabaseContext _genericServersContext;

    private readonly ILogger _logger;


    public JobDataService(ActionDelayDatabaseContext genericServersContext, ILogger<JobDataService> logger,
        ICacheSingletonService cacheSingletonService)
    {
        _cacheSingletonService = cacheSingletonService;
        _genericServersContext = genericServersContext;
        _logger = logger;
    }


    public async Task<Result<DataResponse<JobDataResponse[]>>> GetJobs(CancellationToken token)
    {
        return new DataResponse<JobDataResponse[]>((await _genericServersContext.JobData.ToListAsync(token))
            .Select(JobDataResponse.FromJobData).ToArray());
    }

    public async Task<Result<DataResponse<JobDataResponse>>> GetJob(string jobName, CancellationToken token)
    {
        if (await _cacheSingletonService.DoesJobExist(jobName, token) == false)
            return Result.Fail(new ErrorResponse(404,
                "Could not find job", "job_not_found"));

        var tryGetJob = await _genericServersContext.JobData.FirstOrDefaultAsync(job => job.JobName == jobName, token);
        if (tryGetJob == null)
        {
            return Result.Fail(new ErrorResponse(404,
                "Could not find job", "job_not_found"));
        }

        return new DataResponse<JobDataResponse>(JobDataResponse.FromJobData(tryGetJob));
    }
}