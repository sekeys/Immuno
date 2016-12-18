using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Exceptions
{
    public class StatusException: Exception
    {
        public int StatusCode { get; private set; }
        public StatusException(int statusCode)
        {
            StatusCode = statusCode;
        }
    }
}
