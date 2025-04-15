using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_Api_Worker_Cli.Models
{
    public enum NetType
    {
        Either = 0,
        IPv4 = 1,
        IPv6 = 2
    }

    public enum MethodType
    {
        GET,
        POST,
        PUT,
        PATCH,
        DELETE,
        OPTIONS,
        HEAD
    }
}
