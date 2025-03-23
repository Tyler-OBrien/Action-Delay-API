using System.Diagnostics;
using System.Reflection;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly LocalConfig _config;


        private List<MemoryJob> _jobs = new List<MemoryJob>();





        public Worker(ILogger<Worker> logger, IServiceScopeFactory scopeFactory, IOptions<LocalConfig> config)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _config = config.Value;
            var jobs =
                Assembly.GetExecutingAssembly()
                    .GetExportedTypes()
                    .Where(x => typeof(BaseJob).IsAssignableFrom(x) && x.GetConstructors().Any());
            foreach (var job in jobs)
            {
             _logger.LogInformation($"Found the {job.Name} job...");   
                _jobs.Add(new MemoryJob() { JobName = job.Name, JobType = job });
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {

                await Execute();
                await Task.Delay(1000, stoppingToken);
                if (_config is { BackgroundLocationDataRefresh: true} )
                    _ = ExecuteColoData();
            }
        }

        public DateTime ColoDataNextExecute = DateTime.UtcNow.AddMinutes(1);
        public async Task ExecuteColoData()
        {
            try
            {
                if (DateTime.UtcNow >= ColoDataNextExecute)
                {
                    // instantly alter to prevent double execution
                    ColoDataNextExecute = DateTime.UtcNow.AddMinutes(30);
                    try
                    {
                        using var jobScope = _scopeFactory.CreateScope();
                        var job = jobScope.ServiceProvider.GetRequiredService<IColoDataUpdateService>();
                        await job.Run();
                    
                    }
                    catch (Exception ex)
                    {
                        _logger.LogCritical(ex, "Error in ExecuteColoData Run");
                    }
                    finally
                    {
                        _logger.LogInformation(
                            $"Finished ExecuteColoDate Run, next run in 30 minutes at {ColoDataNextExecute}");
                        ColoDataNextExecute = DateTime.UtcNow.AddMinutes(30);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Error in ExecuteColoData");
            }
        }

        public async Task Execute()
        {
            try
            {
                
                foreach (var memoryJob in _jobs.Where(job => job.Disabled == false).ToList())
                {
                    if (memoryJob.NextExecutionTime == null)
                    {
                        using var jobScope = _scopeFactory.CreateScope();
                        var job = jobScope.ServiceProvider.GetRequiredService(memoryJob.JobType)! as BaseJob;

                        if (job!.Enabled == false)
                        {
                            _logger.LogInformation($"{job.Name} disabled, moving on.");
                            memoryJob.Disabled = true;
                            continue;
                        }

                        var currentDateTime = DateTime.UtcNow;
                        var targetDateTime = new DateTime(currentDateTime.Year, currentDateTime.Month, currentDateTime.Day,
                                                    currentDateTime.Hour, currentDateTime.Minute, 0, currentDateTime.Kind);

                        if (currentDateTime.Second >= job!.TargetExecutionSecond)
                        {
                            targetDateTime = targetDateTime.AddMinutes(1);
                        }

                        memoryJob.NextExecutionTime = targetDateTime.AddSeconds(job!.TargetExecutionSecond);

                        _logger.LogInformation($"First Start, Scheduling {job.Name} to begin at {memoryJob.NextExecutionTime}, about {(memoryJob.NextExecutionTime.Value - DateTime.UtcNow).TotalSeconds} seconds from now, run instantly? {(DateTime.UtcNow >= memoryJob.NextExecutionTime)}.");
                    }
                    if ((memoryJob.RunningTask == null || memoryJob.RunningTask.IsCompleted) &&
                        (DateTime.UtcNow >= memoryJob.NextExecutionTime))
                    {
                        var jobScope = _scopeFactory.CreateScope();
                        var job = jobScope.ServiceProvider.GetRequiredService(memoryJob.JobType)! as BaseJob;



                        var currentDateTime = DateTime.UtcNow;
                        var targetDateTime = new DateTime(currentDateTime.Year, currentDateTime.Month, currentDateTime.Day,
                            currentDateTime.Hour, currentDateTime.Minute, 0, currentDateTime.Kind);

                        if (currentDateTime.Second >= job!.TargetExecutionSecond)
                        {
                            targetDateTime = targetDateTime.AddMinutes(1);
                        }

                        memoryJob.NextExecutionTime = targetDateTime.AddSeconds(job!.TargetExecutionSecond);



                        _logger.LogInformation(
                            $"Running {job.Name} at {DateTime.UtcNow}, next run scheduled at about {(memoryJob.NextExecutionTime.Value - DateTime.UtcNow).TotalSeconds} seconds from now");

                        // now execute
                        memoryJob.Scope = jobScope;
                        var task = RunJobAsync(job, memoryJob);
                        memoryJob.RunningTask = task;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Error in Execute");
                SentrySdk.CaptureException(ex);
            }
        }


        private async Task RunJobAsync(BaseJob job, MemoryJob memoryJob)
        {
            const int maxRetries = 3;
            const int baseDelayMs = 500;
            const int maxDelayMs = 5000;
            Stopwatch startTime = Stopwatch.StartNew();
            for (int attempt = 0; attempt < maxRetries; attempt++)
            {
                try
                {
                    _logger.LogInformation($"Running {job.Name}");
                    await job.BaseRun();
                    _logger.LogInformation($"Completed {job.Name}");
                    break;
                }
                catch (Exception ex)
                {
                    if (ex is CustomAPIError)
                        _logger.LogError(ex, $"Failure API Job {job.Name} had api issues and failed");
                    else 
                        _logger.LogError(ex, $"Failure Job {job.Name} failed");
                    SentrySdk.CaptureException(ex);

                    if (attempt == maxRetries - 1)
                    {
                        _logger.LogError($"All {maxRetries} attempts failed for {job.Name}");
                        break;
                    }

                    if (startTime.ElapsedMilliseconds > 50_000)
                    {
                        _logger.LogError($"Aborting retrying {job.Name} due to timeout"); // we'll relaunch the job the normal way soon anyway
                        break;
                    }
                    int delayMs = Math.Min( (baseDelayMs * (int)Math.Pow(4, attempt)), maxDelayMs); 
                    _logger.LogInformation($"Retrying {job.Name} in {delayMs}ms, attempt {attempt + 1}..");
                    await Task.Delay(delayMs);
                }
                finally
                {
                    memoryJob?.Scope.Dispose();
                }
            }
     
        }
    }
}