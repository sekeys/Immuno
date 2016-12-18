using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Trigger
{
    public interface ITrigger
    {
        string Code { get; set; }
        TriggerMode Mode { get; set; }
        IEnchyma InParam { get; set; }
        Func<IEnchyma,ICorpuscle,bool> On { get; }
        string OnText { get; set; }
        void Invoke();
    }
}
