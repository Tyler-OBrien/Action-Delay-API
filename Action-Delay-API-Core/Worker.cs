using Action_Delay_API_Core.Models.Jobs;
using Microsoft.Extensions.DependencyInjection;

namespace Action_Delay_API_Core
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _serviceProvider;

        private readonly Object _lock = new object();

        public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Execute();
                await Task.Delay(1000, stoppingToken);
            }
        }

        public async Task ExecuteJob(IBaseJob job)
        {
            try
            {
                await job.Execute();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error executing job {job.Name}");
            }
            finally
            {
                lock (_lock)
                {
                    job.IsExecuting = false;
                }
            }
        }

        public async Task Execute()
        {
            try
            {
                foreach (var job in _serviceProvider.GetServices<IBaseJob>())
                {
                    lock (_lock)
                    {
                        if (job.IsExecuting == false)
                        {
                            if ((DateTime.UtcNow - job.LastExecutedUtc) > job.Interval)
                            {
                                _logger.LogInformation($"Running {job.Name} because it's been {(DateTime.UtcNow - job.LastExecutedUtc).TotalMinutes} minutes, and interval is {job.Interval.TotalMinutes}");
                                job.LastExecutedUtc = DateTime.UtcNow;
                                job.IsExecuting = true;
                                // now execute
                                _ = Task.Run(() => ExecuteJob(job));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Errror in Execute");
            }
        }
    }
}