using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public class ScopeDescription
    {
        public List<Scope> Scopes { get; private set; }
        public bool Multiple { get { return Scopes.Count > 1; } }

        private ScopeDescription()
        {
            Scopes = new List<Scope>();
        }

        public Func<IEnchyma[],IEnchyma> CompletedFunc { get; set; }

        public ScopeDescription(OrganizationRuntime runtime,IEnumerable<string> requestPaths)
        {
            Scopes = new List<Scope>();
            foreach(var rp in requestPaths)
            {
                Scopes.Add(new Scope(runtime, rp));
            }

        }
    }
}
