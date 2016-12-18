using Immuno.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Authentication;

namespace Immuno.Organization
{
    public interface IOrganizationGroup
    {
        IEnumerable<IOrganization> Organizations { get; }
        Filration.IFiltration Filter { get; }
        Task<IEnchyma> Serving(IEnchyma enchyma);
        Task<IEnchyma> Serving(IEnchyma enchyma, IWho who);

        void BuildOrganization(string code);

    }
}
