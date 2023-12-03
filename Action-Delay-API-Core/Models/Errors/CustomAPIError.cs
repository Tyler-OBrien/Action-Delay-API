using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Errors
{
    public class CustomAPIError : Exception
    {
        public CustomAPIError()
        {
        }

        public CustomAPIError(string message)
            : base(message)
        {
        }

        public CustomAPIError(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
