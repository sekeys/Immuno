

namespace Immuno.Gene
{
    using Immuno.Features;
    public abstract class GeneFeature :IFeature
    {
        public string Display
        {
            get;
            protected set;
        }

        public abstract void Express(IEnchyma enchyma);
    }
}
