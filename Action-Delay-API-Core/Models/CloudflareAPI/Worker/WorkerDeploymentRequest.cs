using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.Worker
{

    public class WorkerDeploymentRequestDto
    {


        public partial class WorkerDeploymentRequest
        {
            [JsonPropertyName("versions")] public WorkerDeploymentVersion[] Versions { get; set; }

            [JsonPropertyName("annotations")] public WorkerDeploymentAnnotations Annotations { get; set; }
        }

        public partial class WorkerDeploymentAnnotations
        {
            [JsonPropertyName("workers/message")] public string WorkersMessage { get; set; }
        }

        public partial class WorkerDeploymentVersion
        {
            [JsonPropertyName("version_id")] public string VersionId { get; set; }

            [JsonPropertyName("percentage")] public long Percentage { get; set; }
        }
    }
}
