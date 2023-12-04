using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace Action_Deplay_API_Worker.Models.API.Request
{
    public class SerializableHttpRequest
    {
        public string URL { get; set; }

        public Dictionary<string, string> Headers
        {
            get;
            set;
        }
        public int? TimeoutMs { get; set; }

        public NetType? NetType { get; set; }

        public int? HttpType { get; set; }

    }

}
