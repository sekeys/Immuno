using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{
    public class WhoCacheProvider
    {
        protected WhoCacheProvider()
        {
            caches = new System.Collections.Concurrent.ConcurrentDictionary<string, WhoCacheDescr>();
        }
        private System.Collections.Concurrent.ConcurrentDictionary<string,WhoCacheDescr> caches { get; set; }
        private static WhoCacheProvider provider;
        public static WhoCacheProvider Provider
        {
            get
            {
                if (provider == null)
                {
                    provider = new WhoCacheProvider();
                }
                return provider;
            }
        }
        public virtual IWho GetByToken(string token)
        {
            var desc= caches.Values.Where(m=>m.Token.Equals(token)).FirstOrDefault();
            if (desc != null)
            {
                var w = new Who(desc.Token, desc.Name);
                w.ExtendObject = desc;
                return w;
            }
            return null;
        }
        public virtual IWho GetByCacheKey(string key)
        {
            if (caches.ContainsKey(key))
            {
                var desc= caches[key];
                if (desc != null)
                {
                    var w = new Who(desc.Token,desc.Name);
                    w.ExtendObject = desc;
                    return w;
                }
            }
            return null;
        }

        public virtual string Cache(IWho who)
        {
            string key = Guid.NewGuid().ToString();
            WhoCacheDescr desc = new WhoCacheDescr();
            desc.Token = who.Token;
            desc.Name = who.Name;
            desc.Type = who.GetType();
            desc.Extends = who.ExtendObject;
            caches.TryAdd(key,desc);
            return key;

        }
        public virtual string CacheOrUpdate(IWho who)
        {
            string key = Guid.NewGuid().ToString();
            WhoCacheDescr desc = new WhoCacheDescr();
            desc.Token = who.Token;
            desc.Name = who.Name;
            desc.Type = who.GetType();
            desc.Extends = who.ExtendObject;
            caches.AddOrUpdate(key, desc,(k,d)=> { return d; });
            return key;

        }

        public virtual IWho DELETE(IWho who)
        {
            string key = Guid.NewGuid().ToString();
            WhoCacheDescr desc = new WhoCacheDescr();
            caches.TryRemove(who.Token,out desc);

            var w = new Who(desc.Token, desc.Name);
            w.ExtendObject = desc;
            return w;

        }

    }
}
