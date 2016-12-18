using Immuno.Organization.Scope;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Extends
{
    public static class IChainExtends
    {
        public static Corpuscle Corpuscle(this IChain chain)
        {
           return ScopeTypeCacheProvider.Provider.Extract(chain) as Corpuscle;
        }
        public static ICorpuscle Corpuscle(this IChain chain,params object[] parameters)
        {
            return ScopeTypeCacheProvider.Provider.Extract(chain, parameters);
        }
    }
}
