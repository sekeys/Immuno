using Immuno.Features;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Attributes
{
    public class FeatureAttribute:Attribute
    {
        public IFeature Feature { get; private set; }
        public FeatureAttribute(IFeature feature) { Feature = feature; }
    }
}
