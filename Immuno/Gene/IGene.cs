

namespace Immuno.Gene
{
    using Features;

    /// <summary>
    /// 遗传基因
    /// </summary>
    public interface IGene
    {
        GeneFeatureCollection Features { get;  }
        void Expresse(IEnchyma enchyma);
        void Register(GeneFeature feature);
        void UnRegister(GeneFeature feature);
        void Reset();

        //ICorpuscle Transfer(IEnchyma enchyma);
        ICorpuscle Corpuscle { get; }
    }
}
