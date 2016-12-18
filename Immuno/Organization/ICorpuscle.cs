
namespace Immuno
{
    using Features;
    using Gene;
    using Filration;
    using System;
    using Organization;

    public interface ICorpuscle
    {
        string Text { get; }
        OrganizationRuntime OrgRuntime { get; }
        ICorpuscle Original { get; }
        IGene Gene { get; }

        IEnchyma Serving(IEnchyma enchyma);
        IFiltration Filtration { get; }
        IEnchyma Next(IEnchyma enchyma);

        ICorpuscle Mutate(Func<ICorpuscle, ICorpuscle> func);
        ICorpuscle Mutate(Type corpuscleType, GeneFeatureCollection features);
        ICorpuscle Mutate(Type corpuscleType, GeneFeature features);
        //void Adhere(IEnchyma echyma);
        void Adhere(GeneFeature feature);
        void Adhere(GeneFeatureCollection features);
        void Inherit(ICorpuscle corpuscle, GeneFeatureCollection features);
        void Inherit(ICorpuscle corpuscle, GeneFeature features);
        void Inherit(ICorpuscle corpuscle);
    }

    public interface ICorpuscle<T>:ICorpuscle
    {
        T Server { get; }
    }
}
