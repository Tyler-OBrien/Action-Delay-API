using System.Reflection;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Microsoft.Extensions.DependencyInjection;

namespace Action_Delay_API_Core
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceScopeFactory _scopeFactory;


        private List<MemoryJob> _jobs = new List<MemoryJob>();





        public Worker(ILogger<Worker> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;

            var jobs =
                Assembly.GetExecutingAssembly()
                    .GetExportedTypes()
                    .Where(x => typeof(IBaseJob).IsAssignableFrom(x) && x.GetConstructors().Any());
            foreach (var job in jobs)
            {
                
                _jobs.Add(new MemoryJob() { JobName = job.Name, JobType = job });
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Execute();
                await Task.Delay(1000, stoppingToken);
            }
        }


        public async Task Execute()
        {
            try
            {
                
                foreach (var memoryJob in _jobs)
                {
                    if ((memoryJob.RunningTask == null || memoryJob.RunningTask.IsCompleted) && (DateTime.UtcNow - memoryJob.LastExecutedUtc) > TimeSpan.FromMinutes(1))
                    {
                        var jobScope = _scopeFactory.CreateScope();
                        var job = jobScope.ServiceProvider.GetRequiredService(memoryJob.JobType)! as IBaseJob;

                        _logger.LogInformation(
                            $"Running {job.Name} because it's been {(DateTime.UtcNow - memoryJob.LastExecutedUtc).TotalMinutes} minutes, and interval is {job.Interval.TotalMinutes}");
                        memoryJob.LastExecutedUtc = DateTime.UtcNow;
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
            }
        }


        private async Task RunJobAsync(IBaseJob job, MemoryJob memoryJob)
        {
            try
            {
                _logger.LogInformation($"Running {job.Name}");
                await job.BaseRun();
                _logger.LogInformation($"Completed {job.Name}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"{job.Name} failed");
            }
            finally
            {
                memoryJob?.Scope.Dispose();
            }
        }
    }
}