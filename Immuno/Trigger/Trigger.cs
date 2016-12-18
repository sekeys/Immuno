using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Trigger
{
    public class Trigger
    {
        public Trigger()
        {
            Triggers = new Dictionary<string, ITrigger>();
        }
        public Dictionary<string, ITrigger> Triggers { get; private set; }

        public void Invoke(ICorpuscle corpuscle, IEnchyma enchyma)
        {
            Task.Run(() =>
            {
                Triggers.Values.AsParallel().ForAll(m =>
                {
                    m.InParam = enchyma;
                    if (m.Mode == TriggerMode.OnText && corpuscle.Text.Equals(m.OnText))
                    {
                        m.Invoke();

                    }
                    else if (m.Mode == TriggerMode.OnWhere && m.On.Invoke(enchyma, corpuscle))
                    {
                        m.Invoke();
                    }
                });
            });

        }
        public void Add(ITrigger trigger)
        {
            if (Triggers.ContainsKey(trigger.Code))
            {
                Triggers[trigger.Code] = trigger;
            }
            else
            {
                Triggers.Add(trigger.Code, trigger);
            }
        }
        public void Remove(ITrigger trigger)
        {
            if (Triggers.ContainsKey(trigger.Code))
            {
                Triggers.Remove(trigger.Code);
            }
        }
        public void Remove(string code)
        {
            if (Triggers.ContainsKey(code))
            {
                Triggers.Remove(code);
            }
        }
        private static Trigger _Trigger = null;

        public static Trigger Instance
        {
            get
            {
                return _Trigger;
            }
        }

        public static void Register(Trigger trigger)
        {
            _Trigger = trigger;
        }
    }

}
