using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public class MemScopeTypeCache : IScopeTypeCache
    {
        public MemScopeTypeCache(Type type)
        {
            Type = type;
        }
        public MemScopeTypeCache(object obj)
        {
            Type = obj.GetType();
        }

        public Type GenericsType
        {
            get
            {
                return Type.DeclaringType;
            }
        }

        public bool IsGenerics
        {
            get
            {
                return Type.DeclaringType != null;
            }
        }


        public Type Type { get; protected set; }
        public object CreateInstance()
        {
            if (IsGenerics)
            {
                return CreateInstance(ServicesHost.Host.Acquire(GenericsType));
            }
            return System.Activator.CreateInstance(Type);
        }

        public object CreateInstance(params object[] parameters)
        {
            return System.Activator.CreateInstance(Type, parameters);
        }
    }
}
