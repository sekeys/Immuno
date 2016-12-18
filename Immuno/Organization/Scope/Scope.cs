using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public class Scope : IScope
    {
        public Scope(OrganizationRuntime orgRuntime,RawChain raw)
        {
            Raw = raw;
            Runtime = orgRuntime;
            Root = orgRuntime.Organization.Chain;
            Current = orgRuntime.Organization.Chain;
        }

        public Scope(OrganizationRuntime orgRuntime, string pattern) : this(orgRuntime,new RawChain(pattern))
        {

        }
        public Scope(OrganizationRuntime orgRuntime, string pattern, IChain root)
        {
            Raw = new RawChain(pattern);
            Root = root;
            Current = root;
        }
        public IChain Root
        {
            get;
            protected set;
        }
        public IChain Current
        {
            get;
            private set;
        }
        public OrganizationRuntime Runtime
        {
            get;
            protected set;
        }

        public RawChain Raw
        {
            get;
            protected set;
        }

        public bool Contains(string text)
        {
            var count = Raw.Count;
            for (var i = 0; i < count; i++)
                if (text.Equals(Raw.Text(i)))
                {
                    return true;
                }
            return false;
        }

        public bool Match(string pattern)
        {
            Require.NotWhitespace(pattern);
            return Raw.ToString().Equals(pattern);
        }

        public IChain Next(IChain current)
        {
            Require.NotNull(current);
            Raw.Next();

            return current.Next(Raw);
        }
        public IChain Next()
        {
            Current= Next(Current);
            return Current;
        }

        public IScope Clone()
        {
            return new Scope(Runtime,Raw.ToString());
        }

        public bool CanNext()
        {
            return Raw.Current+1 < Raw.Count;
        }
    }
}
