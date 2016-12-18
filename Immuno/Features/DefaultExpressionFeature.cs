

namespace Immuno.Features
{
    using Immuno.Features;
    using System;
    public class DefaultExpressionFeature<T>:IExpressFeature<T>
    {
        public DefaultExpressionFeature( Func<T, bool> func):this("default",func)
        {
        }
        public DefaultExpressionFeature(string display,Func<T,bool> func)
        {
            Func = func;
        }

        public string Display
        {
            get;
            protected set;
        }
        protected Func<T,bool> Func;
        public bool Express(T t)
        {
            return Func.Invoke(t);
        }
    }
}
