using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Nervus.Reflex
{
    using Immuno.Exceptions;
    public class DefaultReflex : Reflex
    {
        public DefaultReflex()
        {
            m_Behaviors = new System.Collections.Concurrent.ConcurrentDictionary<string, IReflexBehavior>();
        }
        /// <summary>
        /// 顺序触发
        /// </summary>
        /// <param name="code"></param>
        /// <param name="parameters"></param>
        public override void Sequential(string code, params object[] parameters)
        {
            Stimulate(code, parameters);
            int lastIndex = code.LastIndexOf('.');
            while (lastIndex > 1)
            {
                code = code.Substring(0, lastIndex);
                Stimulate(code, parameters);
                lastIndex = code.LastIndexOf('.');
            }
        }

        public override void Stimulate(string code, params object[] parameters)
        {
            if (!m_Behaviors.ContainsKey(code))
            {
                return;
            }
            
            m_Behaviors[code].Behave(parameters);
        }
    }
}
