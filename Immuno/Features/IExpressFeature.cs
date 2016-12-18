using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features
{
    public interface IExpressFeature<T> : IFeature
    {
        bool Express(T t);
    }
}
