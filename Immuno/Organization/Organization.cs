namespace Immuno.Organization
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Immuno.Organization.Extends;
    using Immuno.Organization.Scope;
    using System;
    using Features;
    using Authentication;

    public class Organization : IOrganization
    {
        public IExpressFeatureCollection<string> Features { get; private set; }
        public Organization(string code)
        {
            Code = code;
            Chain = new Chain(this);
            //Features=new 
            m_Runtimes = new Dictionary<string, OrganizationRuntime>();
        }
        public string Code
        {
            get;
            protected set;
        }

        public IChain Chain { get; protected set; }

        public async Task<IEnchyma> Serving(IEnchyma enchyma, IWho who = null)
        {
            var requestObject = enchyma["request"];
            OrganizationRuntime orgRuntime = null;
            if (requestObject is String)
            {
                orgRuntime = new OrganizationRuntime(this, requestObject.ToString());
            }
            else
            {
                orgRuntime = new OrganizationRuntime(this, (requestObject as IEnumerable<string>).ToArray());
            }
            this.m_Runtimes.Add(orgRuntime.Guid, orgRuntime);

            return await orgRuntime.Serving(enchyma, who).ContinueWith<IEnchyma>(t =>
             {
                 if (m_Runtimes.ContainsKey(orgRuntime.Guid))
                 {
                     m_Runtimes.Remove(orgRuntime.Guid);
                 }

                 return t.Result;
             });
        }

        public int Count { get { return m_Runtimes.Count; } }

        protected Dictionary<string, OrganizationRuntime> m_Runtimes;
        public IEnumerable<OrganizationRuntime> Runtimes { get { return m_Runtimes.Values; } }
        public IEnumerable<OrganizationRuntime> CurrentRunningOrg
        {
            get
            {
                return Runtimes.Where(m => m.Status == Status.Running);
            }
        }

        public string Guid
        {
            get;
            private set;
        } = System.Guid.NewGuid().ToString();

        public IEnumerable<OrganizationRuntime> OrgRuntimes(Status status)
        {
            if (status == Status.Finish)
            {
                throw new ArgumentException($"the status{status} should be removed,can't found it.");
            }
            return Runtimes.Where(m => m.Status == status);
        }

        /// <summary>
        /// 特征表达
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public bool Express(string request)
        {
            return Features == null || Features.Count == 0 ? true : Features.Express(request);
        }

    }
}
