using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features.RequestTrigger
{
    public interface IRequestTrigger
    {
        string Text { get; }
        bool Trig(string request, out IEnumerable<string> trigRequest);
    }
}
