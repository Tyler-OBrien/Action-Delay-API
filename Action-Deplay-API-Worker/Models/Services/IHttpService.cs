using Action_Deplay_API_Worker.Models.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Deplay_API_Worker.Models.Services
{
    public interface IHttpService
    {
        Task<SerializableHttpResponse> PerformRequestAsync(string url, Dictionary<string, string> headers);
    }
}
