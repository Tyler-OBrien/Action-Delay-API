using Action_Delay_API_Core.Models.API.ColoAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker.ColoData
{
    public interface IColoDataBroker
    {
        Task<Result<ColoAPIData[]>> GetColoData(CancellationToken token);
    }
}
