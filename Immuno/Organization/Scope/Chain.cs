using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Features;

namespace Immuno.Organization.Scope
{
    public class Chain : IChain
    {

        protected Chain()
        {
            Nexts = new ChainCollection();
            
        }
        public Chain(string text) : this()
        {
            Text = text;
            Previous = null;
        }
        public Chain(IOrganization organization) : this()
        {
            Organization = organization;
            Text = "root";
            Previous = null;
        }

        public string Text
        {
            get;
            protected set;
        }

        public IExpressFeatureCollection<RawChain> Features
        {
            get;
            protected set;
        }

        public IChainCollection Nexts
        {
            get;
            protected set;
        }

        public IChain Previous
        {
            get;
            set;
        }

        public IOrganization Organization
        {
            get;
             set;

        }

        public bool Express(RawChain rawChain)
        {
            if (string.IsNullOrWhiteSpace(Text)) { return false; }
            if (Features==null || Features.Count == 0)
            {
                return Text.Equals(rawChain.Text());
            }
            else
            {
                return Features.Express(rawChain);
            }
        }

        public IChain Next(RawChain rawChain)
        {
            
            return Nexts.Where(m => m.Express(rawChain)).FirstOrDefault();
        }

        public void InsertBefore(IChain chain)
        {
            if (!Organization.Equals(chain.Organization))
            {
                chain.Organization = Organization;
            }
            chain.Previous = this.Previous;
            chain.Nexts.Add(this);
            this.Previous = chain;
        }
        public void Insert(IChain chain)
        {
            chain.Organization = Organization;
            Nexts.Add(chain);
            chain.Previous = this;
        }

        public void Register(IExpressFeature<RawChain> feature)
        {
            if (Features.ContainsKey(feature.Display))
            {
                Features[feature.Display]= feature;
            }else
            {
                Features.Add(feature.Display, feature);
            }
        }
        public void Unregister(IExpressFeature<RawChain> feature)
        {
            if (Features.ContainsKey(feature.Display))
            {
                Features.Remove(feature.Display);
            }
        }

        public void Unregister(string display)
        {
            if (Features.ContainsKey(display))
            {
                Features.Remove(display);
            }
        }
    }
}
