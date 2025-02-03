using Microsoft.Extensions.Options;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Sync.Config;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Action_Delay_API_Sync
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly LocalSyncConfig _config;







        public Worker(ILogger<Worker> logger, IOptions<LocalSyncConfig> config)
        {
            _logger = logger;
            _config = config.Value;
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var optionsBuilderSrc = new DbContextOptionsBuilder<ActionDelayDatabaseContext>();
            var optionsBuilderDst = new DbContextOptionsBuilder<ActionDelayDatabaseContext>();
            optionsBuilderSrc.UseNpgsql(_config.PostgresConnectionStringSrc);
            optionsBuilderDst.UseNpgsql(_config.PostgresConnectionStringDst);

            var dbContextPoolSrc = new PooledDbContextFactory<ActionDelayDatabaseContext>(optionsBuilderSrc.Options);
            var dbContextPoolDst = new PooledDbContextFactory<ActionDelayDatabaseContext>(optionsBuilderDst.Options);

            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logger.IsEnabled(LogLevel.Information))
                {
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                }
                try
                {



                    await using ActionDelayDatabaseContext dbContextSrc = dbContextPoolSrc.CreateDbContext();
                    await using ActionDelayDatabaseContext dbContextDst = dbContextPoolDst.CreateDbContext();


                    await RunAsync(dbContextSrc, dbContextDst);


                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Error in Sync Run");
                }
                finally
                {
                    _logger.LogInformation(
                        $"Finished Sync Run");
                }
                await Task.Delay(10_000, stoppingToken);
            }
        }

        public async Task RunAsync(ActionDelayDatabaseContext src, ActionDelayDatabaseContext dst)
        {
            var excludingList = new List<Type>() { typeof(MetalData) };

            // Get all DbSet properties from the source context
            var dbSetProperties = src.GetType()
                .GetProperties()
                .Where(p => p.PropertyType.IsGenericType &&
                            p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));
            

            foreach (var property in dbSetProperties)
            {
                string betterTypeName = null;
                try
                {
                    var getGenericTypeDefinition  = property.PropertyType.GetGenericArguments()[0];
                    betterTypeName = getGenericTypeDefinition.Name;
                    if (excludingList.Contains(getGenericTypeDefinition))
                        continue; // skip

                    // Get the DbSet<T> from both source and destination contexts
                    var srcDbSet = (dynamic)property.GetValue(src);
                    var dstDbSet = (dynamic)property.GetValue(dst);

                    // Call the SyncSet method dynamically
                    await SyncSet(srcDbSet, dstDbSet, dst);
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, $"Error syncing {betterTypeName ?? property.Name}");
                }
            }
            // no save yet...
            var getEntries = dst.ChangeTracker.Entries();
            var changeCount = getEntries.Count(e => e.State == EntityState.Added
                                                    || e.State == EntityState.Modified
                                                    || e.State == EntityState.Deleted);
            await dst.SaveChangesAsync();
            _logger.LogInformation($"Updated {changeCount} rows!");
            
        }

        public async Task SyncSet<T>(DbSet<T> src, DbSet<T> dst, ActionDelayDatabaseContext dstContext) where T : class
        {
            var srcObjs = await src.ToListAsync();
            var dstObjs = await dst.ToListAsync(); // pull into cache yum
            foreach (var srcObj in srcObjs)
            {
                // Find the primary key value of the source object.
                var primaryKey = src.Entry(srcObj).Metadata.FindPrimaryKey();

                // Extract primary key values, handling both single and composite keys
                var primaryKeyValues = primaryKey.Properties
                    .Select(p => p.PropertyInfo.GetValue(srcObj))
                    .ToArray();


                // Find the corresponding object in the destination context.
                var dstObj = await dst.FindAsync(primaryKeyValues);
                
                if (dstObj != null)
                {
                    // Update the destination object with the values from the source object.
                    dst.Entry(dstObj).CurrentValues.SetValues(srcObj);
                }
                else
                {
                    // If the object doesn't exist in the destination, add it.
                    await dst.AddAsync(srcObj);
                }
            }

        }
    }
}
