using Immuno.Organization.Scope;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Extends
{
    public static class ISCopeTypeCacheProviderExtends
    {
        public static T Extract<T>(this ScopeTypeCacheProvider provider, IChain chain)
        {
            var c = provider.Cache($"{chain.Organization.Code}-{chain.Text}");
            if (c == null)
            {
                return default(T);
            }
            return (T)c.CreateInstance();
        }
        public static T Extract<T>(this ScopeTypeCacheProvider provider, IChain chain, params object[] parameters)
        {
            var c = provider.Cache($"{chain.Organization.Code}-{chain.Text}");
            if (c == null)
            {
                return default(T);
            }
            return (T)c.CreateInstance(parameters);
        }

        public static ICorpuscle Extract(this ScopeTypeCacheProvider provider, IChain chain, params object[] parameters)
        {
            var c = provider.Cache($"{chain.Organization.Code}-{chain.Text}");
            if (c == null)
            {
                return null;
            }
            return (ICorpuscle)c.CreateInstance(parameters);
        }
    }
}
