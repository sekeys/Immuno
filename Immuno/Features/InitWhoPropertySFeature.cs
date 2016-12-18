using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Security;
using Immuno.Authentication;
namespace Immuno.Features
{
    public class InitWhoPropertySFeature : IServerFeature
    {
        public string Display
        {
            get; private set;
        }

        public Tuple<IEnchyma, IWho> Express(string request, IEnchyma enc, IWho who)
        {
            throw new NotImplementedException();
        }
        public InitWhoPropertySFeature()
        {
            Display = "init_who_property_value";
        }
    }
}
