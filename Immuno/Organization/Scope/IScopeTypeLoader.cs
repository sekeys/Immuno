using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public interface IScopeTypeLoader : ILoader<ICorpuscle, IChain>
    {
        ICorpuscle LazyLoad(IChain chain);
        ICorpuscle LoadFromCache(IChain chain);
        ICorpuscle LoadFromCache(IScopeTypeCache cache);
    }
}
