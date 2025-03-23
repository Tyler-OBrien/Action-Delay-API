using System.Text.Json.Nodes;

namespace Action_Delay_API.Models.API.Requests.DTOs
{
    public class GenericDataIngestDTO
    {
        public List<GenericDataPoint> Data { get; set; }
    }

    public class GenericDataPoint
    {
        public string InputType { get; set; }

        public JsonNode Data { get; set; }
    }
}
