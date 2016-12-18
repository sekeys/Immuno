using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Nervus.Reflex
{
    public class SimpleReflexDelegate : IReflexDelegate
    {
        private Action<object[]> action;
        public SimpleReflexDelegate(Action<object[]> action)
        {
            Require.NotNull(action);
            this.action = action;
        }
        public void Run(params object[] parameter)
        {
            Require.NotNull(parameter);
            action.Invoke(parameter);
        }
    }
}
