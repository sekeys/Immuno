using Immuno.Features;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public interface IChain
    {
        IOrganization Organization { get; set; }
        string Text { get; }
        IExpressFeatureCollection<RawChain> Features { get; }
        IChainCollection Nexts { get;  }
        IChain Previous { get; set; }
        bool Express(RawChain rawChain);
        IChain Next(RawChain rawChain);
        void InsertBefore(IChain chain);
        void Insert(IChain chain);

        void Register(IExpressFeature<RawChain> feature);
        void Unregister(IExpressFeature<RawChain> feature);
        void Unregister(string display);
    }
}
