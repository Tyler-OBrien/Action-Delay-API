using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.API.CompatAPI
{
    public class DeploymentStatistic
    {
        [JsonPropertyName("t")]
        public string Time { get; set; }

        [JsonPropertyName("workers_deploy_lag")]
        public ulong RunLength { get; set; }

        [JsonPropertyName("run_time")]
        public ulong RunTime { get; set; }

        [JsonPropertyName("deployed")]

        public string Deployed { get; set; }

    }
}
