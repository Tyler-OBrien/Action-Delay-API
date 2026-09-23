using System.ComponentModel;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Requests.DTOs.v2.Analytics
{

    [SwaggerSchema(Required = new[] { "StartDateTime", "EndDateTime", "Metrics" })]
    public class AnalyticsQueryParams
    {
        /// <summary>
        /// The Start Time of the query
        /// </summary>
        [SwaggerParameter("Start Date Time", Required = true)]
        [Required]
        public DateTime? StartDateTime { get; set; }


        /// <summary>
        /// The End Time of the query
        /// </summary>
        [SwaggerParameter("End Date Time", Required = true)]
        [Required]
        public DateTime? EndDateTime { get; set; }

        /// <summary>
        /// Metrics to return.
        /// Run Options: MinRunLength,MaxRunLength,AvgRunLength,MedianRunLength
        /// CF API Response Latency: MinApiResponseLatency,MaxApiResponseLatency,AvgApiResponseLatency,MedianApiResponseLatency
        /// </summary>
        [SwaggerParameter($"Metrics to return. Comma-separated. Specify at least one. <br />  Run Options: MinRunLength,MaxRunLength,AvgRunLength,MedianRunLength <br />  CF API Response Latency: MinApiResponseLatency,MaxApiResponseLatency,AvgApiResponseLatency,MedianApiResponseLatency", Required = true)]
        public string? Metrics { get; set; }

      
        [SwaggerParameter("Max Points to Return, default 100.", Required = false)]
        public int MaxPoints { get; set; } = 100;

        /// <summary>
        /// Exclude runs that failed because of our own measuring apparatus rather than the system
        /// being monitored, so the rate reflects the target. Two cases qualify: an unexpected internal
        /// error (<c>job_error</c>), and a run that missed its coverage threshold mostly because
        /// probes failed rather than because the change did not propagate (<c>probe_degraded</c>).
        /// <para>
        /// Runs rejected by the provider API (<c>api_error</c>) are <b>not</b> excluded - that is a
        /// real failure of the monitored system. Nor are runs that missed coverage because propagation
        /// was genuinely slow.
        /// </para>
        /// <para>
        /// Per-location attribution - transport loss, a dead edge worker, a probe that never reported -
        /// is not visible at this level. Query <c>job_runs_locations.outcome</c> for that.
        /// </para>
        /// <para>
        /// Applies to AI and Perf jobs too: they write to separate tables but share the same
        /// coverage-refinement rule, so they record <c>probe_degraded</c> on the same terms. They still
        /// never record <c>job_error</c> - their <c>BaseRun</c> overrides record nothing at all on an
        /// unhandled error - so only the one predicate can match there.
        /// </para>
        /// Off by default; runs recorded before outcomes were tracked carry none and are kept.
        /// Success-rate endpoint only.
        /// </summary>
        [SwaggerParameter("Exclude runs that failed due to our own probe infrastructure (job_error, probe_degraded) rather than the monitored system. Provider API errors are still counted. Default false.", Required = false)]
        public bool ExcludeInfrastructureFailures { get; set; }
    }

    // lazy way of overriding the metrics comment for now.
    public class AnalyticsQueryParamsLocations : AnalyticsQueryParams
    {
        /// <summary>
        /// The Start Time of the query
        /// </summary>
        [SwaggerParameter("Start Date Time", Required = true)]
        [Required]
        public DateTime? StartDateTime
        {
            get => base.StartDateTime;
            set => base.StartDateTime = value;
        }


        /// <summary>
        /// The End Time of the query
        /// </summary>
        [SwaggerParameter("End Date Time", Required = true)]
        [Required]
        public DateTime? EndDateTime
        {
            get => base.EndDateTime;
            set => base.EndDateTime = value;
        }

        /// <summary>
        /// Metrics to return. \n
        /// Run Options: MinRunLength,MaxRunLength,AvgRunLength,MedianRunLength \n
        /// CF API Response Latency: MinEdgeResponseLatency,MaxEdgeResponseLatency,AvgEdgeResponseLatency,MedianEdgeResponseLatency \n
        /// </summary>
        [SwaggerParameter(
            "Metrics to return. Comma-separated. Specify at least one. <br /> Run Options: MinRunLength,MaxRunLength,AvgRunLength,MedianRunLength <br />  CF API Response Latency: MinEdgeResponseLatency,MaxEdgeResponseLatency,AvgEdgeResponseLatency,MedianEdgeResponseLatency \n",
            Required = false)]
        public string? Metrics
        {
            get => base.Metrics;
            set => base.Metrics = value;
        }


        [SwaggerParameter("Max Points to Return, default 100.", Required = false)]
        public int MaxPoints
        {
            get => base.MaxPoints;
            set => base.MaxPoints = value;
        } 
    }
}
