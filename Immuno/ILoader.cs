using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno
{
    public interface ILoader<T1,T2>
    {
        T2 Load(T1 param);
    }
}
