using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.CustomHostnames
{
    public class ListCustomHostnameResponse
    {
        public partial class CustomHostname
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("hostname")]
            public string Hostname { get; set; }

            [JsonPropertyName("status")]
            public string Status { get; set; }

            [JsonPropertyName("verification_errors")]
            public string[] VerificationErrors { get; set; }


            [JsonPropertyName("created_at")]
            public DateTimeOffset CreatedAt { get; set; }
        }
    }

}
