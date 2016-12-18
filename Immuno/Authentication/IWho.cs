using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{
    public interface IWho : System.Security.Principal.IIdentity
    {
        string Token { get; }
        bool IsGuest { get; }

        bool IsAdmin { get; }
        bool IsSupperMan { get; }

        List<string> Roles { get; }
        WhoProvider Provider { get; }

        object ExtendObject { get; set; }
    }
}
