using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Exceptions
{
    public class IgnoreException<T>:Exception
    {
        public T Tag { get; set; }
        public IgnoreException(T tag)
        {
            Tag = tag;
        }
    }
}
