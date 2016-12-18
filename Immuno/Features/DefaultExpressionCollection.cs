using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features
{
    public class DefaultExpressionCollection<T> : Dictionary<string, IFeature>, IExpressFeatureCollection<T>
    {
        public bool Express()
        {
            return true;
        }

        public bool Express(T t)
        {
            var r = true;
            foreach (var item in this.Values)
            {
                r = r && ((IExpressFeature<T>)(item)).Express(t);
            }
            return r;
        }
    }
}
