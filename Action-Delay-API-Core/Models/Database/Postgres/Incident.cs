using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class Incident : BaseEntityClass
    {
        [Key]
        public Guid Id { get; set; }
        public string RuleId { get; set; }
        public string InternalRuleId { get; set; }
        public string Target { get; set; }

        public string Type { get; set; }
        public TargetType TargetType { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }

        public bool Active { get; set; }
        public string CurrentValue { get; set; }
        public string ThresholdValue { get; set; }
    }

    public enum TargetType
    {
        SingleJob,
        JobType,
        DataSource
    }
}
