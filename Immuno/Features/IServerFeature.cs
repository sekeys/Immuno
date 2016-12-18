using Immuno.Authentication;
using Immuno.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features
{
    public interface IServerFeature:IFeature
    {
        Tuple<IEnchyma, IWho> Express(string request,IEnchyma enc, IWho who);
    }
}
