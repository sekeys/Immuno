
namespace Immuno.Gene
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Features;
    public abstract class GeneFeatureCollection : Dictionary<string,IFeature>, IFeatureCollection
    {
        public new void Add(IFeature feature)
        {
            if (feature == null) { return; }
            
            if (feature is GeneFeature)
            {
                base.Add(feature.Display,feature);
            }
        }
        public new void Add(string key,IFeature feature)
        {
            if (feature == null) { return; }

            if (feature is GeneFeature)
            {
                base.Add(key, feature);
            }
        }
        public bool ContainSameFeature(GeneFeature feature)
        {
            return this.Values.Where(m => m.Equals(feature)).FirstOrDefault() != null;
        }

        public bool Express()
        {
            throw new NotImplementedException();
        }

        public virtual void Express(IEnchyma enchyma)
        {
            this.Values.AsParallel().ForAll(m => {
                ((GeneFeature)m).Express(enchyma);
            });
        }
        
    }
}
