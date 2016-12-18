using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public class DMemScopeTypeCacheProvider : ScopeTypeCacheProvider
    {
        public DMemScopeTypeCacheProvider()
        {
            m_DMemScopeTypeCache = new Dictionary<string, IScopeTypeCache>();
        }
        private Dictionary<string, IScopeTypeCache> m_DMemScopeTypeCache;
        public override void Delete(string cacheKey)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                m_DMemScopeTypeCache.Remove(cacheKey);
            }
        }

        public override bool Exist(string cacheKey)
        {
            return m_DMemScopeTypeCache.ContainsKey(cacheKey);
        }

        public override object Extract(string cacheKey)
        {
            var c = Cache(cacheKey);
            if (c == null)
            {
                return null;
            }
            return c.CreateInstance();
        }

        public override T Extract<T>(string cacheKey)
        {
            var c = Cache(cacheKey);
            if (c == null)
            {
                return default(T);
            }
            return (T)c.CreateInstance();
        }

        public override T Extract<T>(string cacheKey, params object[] parameters)
        {
            var c = Cache(cacheKey);
            if (c == null)
            {
                return default(T);
            }
            return (T)c.CreateInstance(parameters);
        }

        public override void Save(string cacheKey, Type type)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                throw new Exception($"exist cachekey({cacheKey})");
            }
            m_DMemScopeTypeCache.Add(cacheKey, new MemScopeTypeCache(type));
        }

        public override void Save(string cacheKey, object obj)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                throw new Exception($"exist cachekey({cacheKey})");
            }
            m_DMemScopeTypeCache.Add(cacheKey, new MemScopeTypeCache(obj));
        }

        public override void SaveOrUpdate(string cacheKey, object obj)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                m_DMemScopeTypeCache[cacheKey] = new MemScopeTypeCache(obj);
            }
            else
            {
                m_DMemScopeTypeCache.Add(cacheKey, new MemScopeTypeCache(obj));
            }
        }

        public override void Update(string cacheKey, object obj)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                m_DMemScopeTypeCache[cacheKey] = new MemScopeTypeCache(obj);
            }
        }
        public  void Update(string cacheKey, Type type)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                m_DMemScopeTypeCache[cacheKey] = new MemScopeTypeCache(type);
            }
        }


        public override IScopeTypeCache Cache(string cacheKey)
        {
            if (Exist(cacheKey))
            {
                return m_DMemScopeTypeCache[cacheKey];
            }
            return null;
        }

        public override void SaveOrUpdate(string cacheKey, Type type)
        {
            if (m_DMemScopeTypeCache.ContainsKey(cacheKey))
            {
                m_DMemScopeTypeCache[cacheKey] = new MemScopeTypeCache(type);
            }
            else
            {
                m_DMemScopeTypeCache.Add(cacheKey, new MemScopeTypeCache(type));
            }
        }
        
        
        
    }
}
