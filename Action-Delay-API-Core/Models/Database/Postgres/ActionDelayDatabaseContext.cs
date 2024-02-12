using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class ActionDelayDatabaseContext : DbContext
    {
        public ActionDelayDatabaseContext(DbContextOptions<ActionDelayDatabaseContext> contextOptions)
            : base(contextOptions)
        {
        }

        protected ActionDelayDatabaseContext(DbContextOptions contextOptions)
            : base(contextOptions)
        {
        }
        public DbSet<JobData> JobData { get; set; }

        public DbSet<JobDataLocation> JobLocations { get; set; }

        public DbSet<GenericJobData> GenericJobData { get; set; }

        public DbSet<LocationData> LocationData { get; set; }

        public DbSet<ColoData> ColoData { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            modelBuilder.Entity<JobData>().ToTable("Jobs");
            modelBuilder.Entity<JobData>().HasKey(job => job.JobName);



            modelBuilder.Entity<JobDataLocation>().ToTable("JobLocations");
            modelBuilder.Entity<JobDataLocation>().HasKey(location => new  { location.JobName, location.LocationName});
            modelBuilder.Entity<JobDataLocation>()
                .HasOne<JobData>()
                .WithMany()
                .HasForeignKey(location => location.JobName);



            modelBuilder.Entity<GenericJobData>().ToTable("JobData");
            modelBuilder.Entity<GenericJobData>().HasKey(job => job.JobName);

            modelBuilder.Entity<LocationData>().ToTable("LocationData");
            modelBuilder.Entity<LocationData>().HasKey(job => job.LocationName);

            modelBuilder.Entity<ColoData>().ToTable("ColoData");
            modelBuilder.Entity<ColoData>().HasKey(job => job.ColoId);

        }

    }

}
