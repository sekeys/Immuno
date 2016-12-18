using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{
    public class GuestWho : IWho
    {
        public string AuthenticationType
        {
            get;
            private set;
        }

        public object ExtendObject
        {
            get;
            set;
        }

        public bool IsAdmin
        {
            get
            {
                return false;
            }
        }

        public bool IsAuthenticated
        {
            get
            {
                return false;
            }
        }

        public bool IsGuest
        {
            get
            {
                return true;
            }
        }

        public bool IsSupperMan
        {
            get
            {
                return false;
            }
        }

        public string Name
        {
            get;
            private set;
        } = "Guest";

        public WhoProvider Provider
        {
            get
            {
                return WhoProvider.Provider;
            }
        }

        public List<string> Roles
        {
            get;
            private set;
        } = new List<string>();

        public string Token
        {
            get;
            private set;
        } = Guid.NewGuid().ToString();

    }
}
