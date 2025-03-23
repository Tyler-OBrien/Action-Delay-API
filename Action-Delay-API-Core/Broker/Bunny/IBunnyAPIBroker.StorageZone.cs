using Action_Delay_API_Core.Models.BunnyAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial interface IBunnyAPIBroker
    {
        public Task<Result<BunnyAPIResponse>> UploadFileStorageZone(string storageZone, string fileName,
            string data, string apiToken, CancellationToken token);

    }
}
