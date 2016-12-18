using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Nervus.Reflex
{
    public class SimpleReflexBehave : IReflexBehavior
    {
        protected SimpleReflexBehave() { }
        public bool Async { get; protected set; }
        public SimpleReflexBehave(string code) { Delegates = new ReflexDelegateCollection(); Code = code; Async = false; }
        public SimpleReflexBehave(string code, bool async) { Delegates = new ReflexDelegateCollection(); Code = code; Async = async; }
        public string Code
        {
            get;
            protected set;
        }

        public ReflexDelegateCollection Delegates
        {
            get;
        }
        public void AddDeletegate(Action<object[]> action)
        {
            SimpleReflexDelegate srd = new SimpleReflexDelegate(action);
            Delegates.Add(srd);
        }
        public void AddDeletegate(IReflexDelegate reflex)
        {
            Delegates.Add(reflex);
        }
        public void RemoveDeletegate(IReflexDelegate reflex)
        {
            Delegates.Remove(reflex);
        }
        public void Behave(params object[] parameters)
        {
            if (Async)
            {
                Delegates.AsParallel().ForAll(m =>
                {
                    if (m is IReflexDelegate)
                    {
                        ((IReflexDelegate)m).Run();
                    }
                    else if (m is IReflexDelegateAsync)
                    {
                        ((IReflexDelegateAsync)m).RunAsync();
                    }
                });
            }
            else
            {
                foreach (var m in Delegates)
                {
                    if (m is IReflexDelegate)
                    {
                        ((IReflexDelegate)m).Run(parameters);
                    }
                    else if (m is IReflexDelegateAsync)
                    {
                        ((IReflexDelegateAsync)m).RunAsync(parameters);
                    }
                }
            }
        }
    }
}
