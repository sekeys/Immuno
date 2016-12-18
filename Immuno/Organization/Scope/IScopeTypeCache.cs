using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public interface IScopeTypeCache
    {
        object CreateInstance();
        object CreateInstance(params object[] parameters);
        bool IsGenerics { get; }
        Type GenericsType { get; }
    }
}
