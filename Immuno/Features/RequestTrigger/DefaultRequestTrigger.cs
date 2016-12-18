using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features.RequestTrigger
{
    public class DefaultRequestTrigger : IRequestTrigger
    {
        public bool IsRegex { get; set; }
        public string Text { get; set; }
        private System.Text.RegularExpressions.Regex regex;
        public List<string> TrigRequest { get; private set; }
        public virtual bool Trig(string request, out IEnumerable<string> trigRequest)
        {
            trigRequest = null;
            if ((IsRegex && regex.IsMatch(request)) || Text.Equals(request))
            {
                trigRequest = Process();
            }
            return false;
        }
        public virtual IEnumerable<string> Process()
        {
            return TrigRequest;
        }
    }
}
