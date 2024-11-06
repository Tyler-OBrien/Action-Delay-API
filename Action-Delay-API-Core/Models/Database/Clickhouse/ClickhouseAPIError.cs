using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;

namespace Action_Delay_API_Core.Models.Database.Clickhouse
{
    public class ClickhouseAPIError : IClickhouseError
    {

        public static ClickhouseAPIError? CreateFromCustomError(string jobName, CustomAPIError? error)
        {
            if (error == null) return null;
            var newClickhouseError = new ClickhouseAPIError()
            {
                RunTime = DateTime.UtcNow,
                JobName = jobName,
                ErrorDescription = error.SimpleErrorMessage,
                ErrorType = String.IsNullOrWhiteSpace(error.WorkerStatusCode)
                    ? error.StatusCode.ToString()
                    : error.WorkerStatusCode,
                ResponseLatency = (uint)(error.ResponseTimeMs ?? 0),
                LocationName = error.LocationName,
                ColoId = error.ColoId,
            };
            newClickhouseError.ErrorHash =
                Sha256Hash(newClickhouseError.ErrorDescription, newClickhouseError.ErrorType);
            return newClickhouseError;
        }

        public static string Sha256Hash(CustomAPIError error) => Sha256Hash(error.SimpleErrorMessage,
            String.IsNullOrWhiteSpace(error.WorkerStatusCode)
                ? error.StatusCode.ToString()
                : error.WorkerStatusCode);
        public static String Sha256Hash(string errorDescription, string errorType)
        {
            StringBuilder Sb = new StringBuilder();

            using (var hash = SHA256.Create())
            {
                Encoding enc = Encoding.UTF8;
                byte[] resultDescription = hash.ComputeHash(enc.GetBytes(errorDescription));

                foreach (byte b in resultDescription)
                    Sb.Append(b.ToString("x2"));

                byte[] resultType = hash.ComputeHash(enc.GetBytes(errorType));

                foreach (byte b in resultType)
                    Sb.Append(b.ToString("x2"));
            }

            return Sb.ToString();
        }

        public string JobName { get; set; }


        // Used only for AI
        public string LocationName { get; set; }

        public DateTime RunTime { get; set; }
        public string ErrorType { get; set; }
        public string ErrorDescription { get; set; }

        public string ErrorHash { get; set; }

        public UInt64 ResponseLatency { get; set; }

        public int? ColoId { get; set; }
    }
}
