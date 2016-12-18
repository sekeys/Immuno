

namespace Immuno.Nervus.Reflex
{
    using System.Collections;
    using System.Collections.Concurrent;
    using System.Collections.Generic;

    public abstract class Reflex
    {

        protected ConcurrentDictionary<string, IReflexBehavior> m_Behaviors;

        public ICollection<IReflexBehavior> Behaviors
        {
            get
            {
                return m_Behaviors.Values;
            }
        }
        public virtual void Register(IReflexBehavior behavior)
        {
            Require.NotNull(behavior);
            if (m_Behaviors.ContainsKey(behavior.Code))
            {

            }
            m_Behaviors.TryAdd(behavior.Code, behavior);
        }
        public virtual void Unregister(IReflexBehavior behavior)
        {
            Require.NotNull(behavior);
            if (m_Behaviors.ContainsKey(behavior.Code))
            {
                m_Behaviors.TryRemove(behavior.Code, out behavior);
            }
        }
        public virtual IReflexBehavior Unregister(string code)
        {
            Require.NotNull(code);
            IReflexBehavior behavior = null;
            if (m_Behaviors.ContainsKey(code))
            {
                m_Behaviors.TryRemove(code, out behavior);
            }
            return behavior;
        }
        public virtual SimpleReflexBehave Register(string code, bool async=false)
        {
            Require.NotNull(code);
            var srb = new SimpleReflexBehave(code, async);
            Register(srb);
            return srb;
        }
        public abstract void Stimulate(string code, params object[] parameters);
        public abstract void Sequential(string code, params object[] parameters);

        private static Reflex s_Reflex;

        public static Reflex ReflexArc
        {
            get
            {
                if (s_Reflex == null) { s_Reflex = new DefaultReflex(); }
                return s_Reflex;
            }
        }
        public static void RegisterReflex(Reflex reflex)
        {
            Require.NotNull(reflex);
            s_Reflex = reflex;
        }
    }
}
