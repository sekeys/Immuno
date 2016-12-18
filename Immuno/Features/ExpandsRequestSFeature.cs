using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Security;
using Immuno.Authentication;

namespace Immuno.Features
{


    public class ExpandsRequestSFeature : IServerFeature
    {
        public List<RequestTrigger.IRequestTrigger> Triggers { get; private set; }
        public string Display
        {
            get;
            private set;
        }

        public Tuple<IEnchyma, IWho> Express(string request, IEnchyma enc, IWho who)
        {
            IEnumerable<string> rs = new List<string>();
            foreach (var t in Triggers)
            {
                if (t.Trig(request, out rs)) { break; };
            }
            if (rs.Count() < 1)
            {
                rs=rs.Append(request);
            }
            enc["request"] = rs;
            return new Tuple<IEnchyma, IWho>(enc, who);
        }
        public ExpandsRequestSFeature()
        {
            Display = "expand_request_to_multil_request_trigger";
            Triggers = new List<RequestTrigger.IRequestTrigger>();
            InitTrigger();
        }

        protected void InitTrigger()
        {
            var sections = Configuration.ConfigurationManager.Manager.Sections("expands:expandrequest");
            foreach (var section in sections)
            {
                if (section == null || section.Value==null) { continue; }
                var rt = new RequestTrigger.DefaultRequestTrigger();
                rt.IsRegex = "true".Equals(section.GetSection("isregex").Value) ? true : false;
                rt.Text = section.GetSection("text").Value;
                foreach(var s in section.GetSection("trigger").GetChildren())
                {
                    rt.TrigRequest.Add(s.Value);
                }
                Triggers.Add(rt);
            }
        }
    }
}
