using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno
{
    public class ServicesHost
    {
        private System.Collections.Concurrent.ConcurrentDictionary<Type, object> Mapping = new System.Collections.Concurrent.ConcurrentDictionary<Type, object>();
        public void AddServices(Type type,Object value)
        {
            if (Mapping.ContainsKey(type))
            {
                Mapping[type] = value;
            }
        }
        public void AddServices<T>(T value)
        {
            AddServices(typeof(T), value);
        }
        public object Acquire(Type type)
        {
            if (Mapping.ContainsKey(type))
            {
                return Mapping[type];
            }
            return null;
        }
        public T Acquire<T>()
        {
            Type type = typeof(T);
            if (Mapping.ContainsKey(type))
            {
                return (T)Mapping[type];
            }
            return default(T);
        }
        private static ServicesHost s_Host;
        private static object locker = new object();
        public static ServicesHost Host
        {
            get
            {
                if (s_Host==null)
                {
                    lock (locker)
                    {
                        if (s_Host == null)
                        {
                            s_Host = new ServicesHost();
                        }
                    }

                }
                return s_Host;
            }
        }
        public static void RegisterHost(ServicesHost host)
        {
            s_Host = host;
        }
    }
}
