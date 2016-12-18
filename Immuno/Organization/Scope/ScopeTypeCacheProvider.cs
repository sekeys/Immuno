using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public abstract class ScopeTypeCacheProvider
    {
        public abstract void Save(string cacheKey,object obj);
       public abstract void SaveOrUpdate(string cacheKey, object obj);

        public abstract void Save(string cacheKey, Type type);
        public abstract void SaveOrUpdate(string cacheKey, Type type);
        public abstract bool Exist(string cacheKey);

        public abstract IScopeTypeCache Cache(string cacheKey);
        public abstract T Extract<T>(string cacheKey);
        public abstract T Extract<T>(string cacheKey,params object[] parameters);

        public abstract object Extract(string cacheKey);
        public abstract void Update(string cacheKey,object obj);

        public abstract void Delete(string cacheKey);

        private static object locker = new object();

        private static ScopeTypeCacheProvider s_Provider;
        public static ScopeTypeCacheProvider Provider
        {
            get
            {
                if (s_Provider == null)
                {
                    lock (locker)
                    {
                        if (s_Provider == null)
                        {
                            s_Provider = new DMemScopeTypeCacheProvider();
                        }
                    }
                }
                return s_Provider;
            }
        }
        public static void RegisterProvider(ScopeTypeCacheProvider provider)
        {
            s_Provider = provider;
        }
    }
}
