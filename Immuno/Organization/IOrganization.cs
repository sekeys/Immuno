using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization
{
    using Scope;
    using Authentication;

    public interface IOrganization
    {
        string Guid { get; }
        IChain Chain { get; }
        string Code { get; }
        Task<IEnchyma> Serving(IEnchyma enchyma,IWho who=null);
        bool Express(string request);
        int Count { get; }
        IEnumerable<OrganizationRuntime> Runtimes { get; }
        IEnumerable<OrganizationRuntime> CurrentRunningOrg { get; }
        IEnumerable<OrganizationRuntime> OrgRuntimes(Status status);
        //void Break();
    }
}
