using FluentResults;

namespace Action_Delay_API_Core.Models.Errors
{
    public class CustomAPIError : Exception, IError
    {
        public CustomAPIError()
        {
        }

        public CustomAPIError(string message)
            : base(message)
        {
        }

        public CustomAPIError(string message, int statusCode, string simpleErrorMessage, string workerStatusCode)
            : base(message)
        {
            StatusCode = statusCode;
            SimpleErrorMessage = simpleErrorMessage;
            WorkerStatusCode = workerStatusCode;
        }

        public CustomAPIError(string message, Exception inner)
            : base(message, inner)
        {
        }

        public int StatusCode { get; set; }

        public string WorkerStatusCode { get; set; }

        public string SimpleErrorMessage { get; set; }
        public Dictionary<string, object> Metadata { get; }
        public List<IError> Reasons { get; }
    }
}
