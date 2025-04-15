using System.Diagnostics;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Text.Json;
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

        public static string lastCacheDatesFile = Path.Combine(Assembly.GetEntryAssembly().Location, "lastCacheDates.json");

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            try
            {
                if (File.Exists(lastCacheDatesFile))
                    lastCacheDates =
                        System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, DateTime>>(
                            File.ReadAllText(lastCacheDatesFile));
            }
            catch (Exception)
            {
                
                lastCacheDates = new Dictionary<string, DateTime>();
            }
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

                    try
                    {
                        await File.WriteAllTextAsync(lastCacheDatesFile, JsonSerializer.Serialize(lastCacheDates), stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Issue with saving last cache dates");
                    }

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

        public static DateTime _lastSyncBigTables = DateTime.MinValue;

        public async Task RunAsync(ActionDelayDatabaseContext src, ActionDelayDatabaseContext dst)
        {
            int rowsPulled = 0;
            Stopwatch stopWatch = Stopwatch.StartNew();
            var excludingList = new List<Type>() { typeof(MetalData) };

            // Get all DbSet properties from the source context
            var dbSetProperties = src.GetType()
                .GetProperties()
                .Where(p => p.PropertyType.IsGenericType &&
                            p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));

            if (DateTime.UtcNow - _lastSyncBigTables > TimeSpan.FromMinutes(10))
            {
                // it's been 10 minutes since last sync of big tables
                _lastSyncBigTables = DateTime.UtcNow;
            }
            else
            {
                // strip big tables..
                excludingList.AddRange(new List<Type>()
                {
                    typeof(LocationData),
                    typeof(ColoData),
                });
            }



            foreach (var property in dbSetProperties)
            {
                string betterTypeName = null;
                try
                {
                    var getGenericTypeDefinition = property.PropertyType.GetGenericArguments()[0];
                    betterTypeName = getGenericTypeDefinition.Name;
                    if (excludingList.Contains(getGenericTypeDefinition))
                        continue; // skip

                    var srcDbSet = (dynamic)property.GetValue(src);
                    var dstDbSet = (dynamic)property.GetValue(dst);

                    rowsPulled += await SyncSet(srcDbSet, dstDbSet, dst);
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

            try
            {
                foreach (var entry in dst.ChangeTracker.Entries()
                             .Where(e => e.State == EntityState.Added
                                         || e.State == EntityState.Modified
                                         || e.State == EntityState.Deleted))
                {
                    entry.Property("LastEditDate").CurrentValue = DateTime.UtcNow;
                    entry.Property("LastEditDate").IsModified = true;
                }
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
            }

            await dst.SaveChangesAsync();
            _logger.LogInformation($"Updated {changeCount} rows, {stopWatch.ElapsedMilliseconds}ms, pulled {rowsPulled} rows!");
        }

        public Dictionary<string, DateTime> lastCacheDates = new Dictionary<string, DateTime>();

        public Dictionary<string, List<object>> objectsCache = new Dictionary<string, List<object>>();

        public async Task<int> SyncSet<T>(DbSet<T> src, DbSet<T> dst, ActionDelayDatabaseContext dstContext) where T : class
        {
            int rowsPulled = 0;
            DateTime lastSyncDate = DateTime.MinValue;

            if (lastCacheDates.TryGetValue(src.EntityType.Name, out var lastCacheDate))
                lastSyncDate = lastCacheDate;

            List<T> objectCache = new List<T>();
            lastCacheDates[src.EntityType.Name] = DateTime.UtcNow;

            var srcObjs = await src.Where("LastEditDate >= @0", lastSyncDate).ToListAsync();
            rowsPulled += srcObjs.Count;
            if (objectsCache.TryGetValue(src.EntityType.Name, out var foundObjects))
            {
                objectCache = foundObjects.Cast<T>().ToList();
                dst.AttachRange(objectCache);
            }
            else
            {
                objectCache = await dst.ToListAsync(); // pull into cache 
                objectsCache[src.EntityType.Name] = objectCache.Cast<object>().ToList();
                rowsPulled += objectCache.Count;
            }



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
                    objectCache.Add(srcObj);
                }
            }

            return rowsPulled;
        }
    }
}
