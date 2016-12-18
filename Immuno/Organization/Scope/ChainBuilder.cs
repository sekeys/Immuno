
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    using Attributes;
    using Features;
    using System;
    using System.Reflection;
    public class ChainBuilder
    {
        private static ChainBuilder s_Builder;
        private static object locker = new object();

        public static ChainBuilder Builder
        {
            get
            {
                if (s_Builder == null)
                {
                    lock (locker)
                    {
                        s_Builder = new ChainBuilder();
                    }
                }
                return s_Builder;
            }
        }

        public IChain BuildChain(Type type)
        {
            var chain = System.Activator.CreateInstance(type) as IChain;
            if (chain == null)
            {
                throw new Exception($"{type.FullName} is not base type of IChain");
            }
            //根据类型的特性进features填充
            var customAttributes = type.GetTypeInfo().GetCustomAttributes<FeatureAttribute>(true)
                .Where(m => ((FeatureAttribute)m).Feature is IExpressFeature<RawChain>);
            foreach (var attribute in customAttributes)
            {
                chain.Register(attribute.Feature as IExpressFeature<RawChain>);
            }
            return chain;
        }
        public IChain BuildChain(Type type,params object[] parameters)
        {
            var chain = System.Activator.CreateInstance(type, parameters) as IChain;
            if (chain == null)
            {
                throw new Exception($"{type.FullName} is not base type of IChain");
            }
            //根据类型的特性进features填充
            var customAttributes = type.GetTypeInfo().GetCustomAttributes<FeatureAttribute>(true)
                .Where(m => ((FeatureAttribute)m).Feature is IExpressFeature<RawChain>);
            foreach (var attribute in customAttributes)
            {
                chain.Register(attribute.Feature as IExpressFeature<RawChain>);
            }

            return chain;
        }

        public IChain BuildDefaultChain(string text)
        {
            return new Chain(text);
        }
    }
}
