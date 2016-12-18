using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Nervus.Reflex
{
    public class SimpleReflexDelegateAsync : IReflexDelegateAsync
    {
        private Action<object[]> action;
        public SimpleReflexDelegateAsync(Action<object[]> action)
        {
            Require.NotNull(action);
            this.action = action;
        }
        public void RunAsync(params object[] parameter)
        {
            Require.NotNull(parameter);
            action.Invoke(parameter);
        }
    }
}
