using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public interface IScope
    {
        IChain Root { get; }
        IChain Current { get; }
        bool Match(string pattern);
        IChain Next(IChain current);
        RawChain Raw { get; }
        bool Contains(string text);
        IChain Next();
        OrganizationRuntime Runtime { get; }
        IScope Clone();
        bool CanNext();
    }

}
