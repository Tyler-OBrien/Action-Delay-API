using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    /// <summary>
    /// The same model pointed at this node's local database - the one its origin API reads. Exists
    /// only because EF cannot pool two connections under a single context type;
    /// <see cref="ActionDelayDatabaseContext"/> remains the primary everything else uses.
    /// </summary>
    public class LocalActionDelayDatabaseContext : ActionDelayDatabaseContext
    {
        public LocalActionDelayDatabaseContext(DbContextOptions<LocalActionDelayDatabaseContext> contextOptions)
            : base(contextOptions)
        {
        }
    }
}
