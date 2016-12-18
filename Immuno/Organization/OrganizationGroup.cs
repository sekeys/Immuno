using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Filration;
using Immuno.Security;
using Immuno.Authentication;

namespace Immuno.Organization
{
    public class OrganizationGroup : IOrganizationGroup
    {
        private static OrganizationGroup s_Group;
        private static object locker = new object();
        public static OrganizationGroup Group
        {
            get
            {
                if (s_Group == null)
                {
                    lock (locker)
                    {
                        s_Group = new OrganizationGroup();
                    }
                }
                return s_Group;
            }
        }
        public OrganizationGroup()
        {
            Orgs = new List<IOrganization>();
        }
        public IFiltration Filter
        {
            get;
            internal protected set;
        }

        private List<IOrganization> Orgs;
        public IEnumerable<IOrganization> Organizations
        {
            get { return Orgs; }
        }

        public void BuildOrganization(string code)
        {
            IOrganization org = new Organization(code);
            Register(org);
        }
        public void Register(IOrganization organization)
        {
            Orgs.Add(organization);
        }
        public void Unregister(IOrganization org)
        {
            if (Organizations.Contains(org))
            {
                Organizations.ToList().Remove(org);
            }
        }
        public async Task<IEnchyma> Serving(IEnchyma enchyma)
        {
            return await Serving(enchyma, null);
        }

        public async Task<IEnchyma> Serving(IEnchyma enchyma, IWho who)
        {
            if (Filter != null)
            {
                enchyma = Filter.In(enchyma);
            }
            IEnchyma res = null;
            if (Organizations.Count() != 0)
            {
                res = await Organizations.Where(m => m.Express(enchyma.String("request"))).First()?.Serving(enchyma, who);
            }
            return Filter == null ? res : Filter.Out(res);
        }

        public T TypeOf<T>(string name)
        {
            var obj = Organizations.Where(m => m.Code.Equals(name)).FirstOrDefault();
            if (obj is T)
            {
                return (T)obj;
            }
            return default(T);
        }
        public IEnumerable<T> OfType<T>()
        {
            return Organizations.Where(m => m is T) as IEnumerable<T>;
        }
        public void ResetFiltration(IFiltration filter)
        {
            Filter = filter;
        }
    }
}
