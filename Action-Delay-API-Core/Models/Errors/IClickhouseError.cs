using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Errors
{
    public interface IClickhouseError
    {
        public string ErrorType { get; set; }
        public string ErrorDescription { get; set; }
        public string ErrorHash { get; set; }
    }
}
