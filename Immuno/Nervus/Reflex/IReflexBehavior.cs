using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Nervus.Reflex
{
    public interface IReflexBehavior:IBehavior
    {
        string Code { get; }
        ReflexDelegateCollection Delegates { get;  }
        
    }
}
