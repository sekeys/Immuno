using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Interface
{
    public interface IConvertible
    {
        T Convert<T>();
    }
}
