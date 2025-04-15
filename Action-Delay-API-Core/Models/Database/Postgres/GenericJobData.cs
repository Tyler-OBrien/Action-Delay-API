using System.ComponentModel.DataAnnotations;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class GenericJobData : BaseEntityClass
    {
        [Required]
        [Key]
        public string JobName { get; set; }

        public string Value { get; set; }

        public string Metadata { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
