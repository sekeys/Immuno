using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{
    public abstract class WhoProvider
    {
        private static WhoProvider s_Provider;
        private static object locker = new object();
        public static WhoProvider Provider
        {
            get
            {
                if (s_Provider == null)
                {
                    lock (locker)
                    {
                        s_Provider = new UnsophisticatedWhoProvider();
                    }
                }
                return s_Provider;
            }
        }
        public static void RegisterProvider(WhoProvider provider)
        {
            s_Provider = provider;
        }

        public abstract bool IsGuest(IWho who);
        public abstract bool IsSupperMan(IWho who);
        public abstract bool IsAdmin(IWho who);
        public abstract IWho Who(string token);

        public abstract void Initialize(IWho who);
    }
}
