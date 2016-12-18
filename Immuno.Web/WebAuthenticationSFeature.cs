using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Authentication;
using Microsoft.AspNetCore.Http;

namespace Immuno.Web
{
    public class WebAuthenticationSFeature : Immuno.Features.IServerFeature
    {
        public WebAuthenticationSFeature()
        {
            Display = "SF_Grant_Web_Authentication";
        }
        public string Display
        {
            get;
            private set;
        }

        public Tuple<IEnchyma, IWho> Express(string request, IEnchyma enc, IWho who)
        {
            HttpContext context = enc["context"] as HttpContext;
            string web_authentication = ImmunoServer.Server.Appsetting["web_authentication_cookie"];
            if (string.IsNullOrWhiteSpace(web_authentication)) { web_authentication = ".u"; }
            string cookies = context.Request.Cookies[web_authentication];
            if (string.IsNullOrWhiteSpace(cookies))
            {
                who = null;
            }
            else
            {
                who = Immuno.Authentication.WhoCacheProvider.Provider.GetByCacheKey(cookies);
            }
            return new Tuple<IEnchyma, IWho>(enc, who);
        }
    }
}
