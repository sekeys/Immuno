using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Nervus.Reflex
{
    public class ReflexDelegateCollection : List<IDelegate>, IDelegateCollection
    {
        public new void Add(IDelegate Delegate)
        {
            Require.NotNull(Delegate);
            if (Delegate is IReflexDelegate || Delegate is IReflexDelegateAsync)
            {
                base.Add(Delegate);
            }
            else
            {
                throw new Exception("添加的Delegate不属于IReflexDelegate或者IReflexDelegateAsync接口");
            }
        }


    }
}
