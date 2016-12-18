using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features
{
    public interface IFeatureCollection : IDictionary<string,IFeature>
    {
        bool Express();
    }
}
