using FluentResults;

namespace Action_Delay_API_Core.Models.Errors
{
    public class CustomAPIErrorPerf : Exception, IError
    {
        public CustomAPIErrorPerf()
        {
        }

        public CustomAPIErrorPerf(string message)
            : base(message)
        {
        }

        public CustomAPIErrorPerf(string message, int statusCode, string simpleErrorMessage, string workerStatusCode, double? responseTimeMs, string? locationId = null)
            : base(message)
        {
            StatusCode = statusCode;
            SimpleErrorMessage = simpleErrorMessage;
            WorkerStatusCode = workerStatusCode;
            ResponseTimeMs = responseTimeMs;
            LocationId = locationId;
        }

        public CustomAPIErrorPerf(string message, Exception inner)
            : base(message, inner)
        {
        }

        // AI only
        public string LocationName { get; set; }

        public int StatusCode { get; set; }

        public string WorkerStatusCode { get; set; }

        public string SimpleErrorMessage { get; set; }

        public double? ResponseTimeMs { get; set; }
        public Dictionary<string, object> Metadata { get; }
        public List<IError> Reasons { get; }

        public string? LocationId { get; set; }
    }
}
