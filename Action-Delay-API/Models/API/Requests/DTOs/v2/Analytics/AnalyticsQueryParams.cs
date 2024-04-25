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
        [Required]
        public string? Metrics { get; set; }

      
        [SwaggerParameter("Max Points to Return, default 100.", Required = false)]
        public int MaxPoints { get; set; } = 100;
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
            Required = true)]
        [Required]
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
