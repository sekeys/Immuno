using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Authentication;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Builder;

namespace Immuno.Web.Authentication
{
    public class FormTicksAuSFeature : Immuno.Features.IServerFeature
    {
        public static string Schema { get; set; } = "u.who";
        public static async void SignIn(HttpContext context, WebAuthenticationWho who)
        {
            ClaimsIdentity id = new ClaimsIdentity(who);
            foreach (var role in who.Roles)
            {
                id.AddClaim(new Claim(ClaimTypes.Role, role));

            }

            id.AddClaim(new Claim(ClaimTypes.NameIdentifier, who.Token));
            id.AddClaim(new Claim(ClaimTypes.UserData, $"{(who.Guest ? "1" : "0")}:{(who.Admin ? "1" : "0")}:{(who.SupperMan ? "1" : "0")}"));
            id.Label = who.Token;
            ClaimsPrincipal claimP = new ClaimsPrincipal(id);
            await context.Authentication.SignInAsync(Schema, claimP);
        }
        public static async void SignIn(HttpContext context, WebAuthenticationWho who, Microsoft.AspNetCore.Http.Authentication.AuthenticationProperties authenticationProperties)
        {
            ClaimsIdentity id = new ClaimsIdentity(who);
            foreach (var role in who.Roles)
            {
                id.AddClaim(new Claim(ClaimTypes.Role, role));

            }

            id.AddClaim(new Claim(ClaimTypes.NameIdentifier, who.Token));
            id.AddClaim(new Claim(ClaimTypes.UserData, $"{(who.Guest ? "1" : "0")}:{(who.Admin ? "1" : "0")}:{(who.SupperMan ? "1" : "0")}"));
            id.Label = who.Token;
            ClaimsPrincipal claimP = new ClaimsPrincipal(id);
            await context.Authentication.SignInAsync(Schema, claimP, authenticationProperties);
        }

        public static  void SignIn(HttpContext context, WebAuthenticationWho who, int expirDay)
        {
            var curDate = DateTime.Now;
            var ExpiresUtc = new DateTimeOffset(curDate.AddDays(expirDay));
            var proper = new Microsoft.AspNetCore.Http.Authentication.AuthenticationProperties();
            proper.ExpiresUtc = ExpiresUtc;
            proper.IssuedUtc = curDate;
            proper.AllowRefresh = true;
            proper.RedirectUri = "/login";
            SignIn(context, who, proper);
        }
        public static void Configure(IApplicationBuilder app, IHttpContextAccessor httpContextAccessor)
        {
        }
        public static async void SignOut(HttpContext context)
        {
            await context.Authentication.SignOutAsync(Schema);
        }
        public static async Task<IWho> Get(HttpContext context)
        {
            var authenticaInfo = await context.Authentication.GetAuthenticateInfoAsync(Schema);

            if (authenticaInfo == null || authenticaInfo.Principal == null)
            {
                return null;
            }
            var iid = authenticaInfo.Principal.Identity as ClaimsIdentity;

            Claim nameIdentifer = iid.FindFirst(ClaimTypes.NameIdentifier);
            var who = new WebAuthenticationWho(nameIdentifer.Value, iid.Name);
            foreach (Claim ci in iid.FindAll(ClaimTypes.Role))
            {
                who.Roles.Add(ci.Value);
            }
            Claim isadmininfo = iid.FindFirst(ClaimTypes.UserData);
            var ss = isadmininfo.Value.Split(':');
            who.Guest = "1".Equals(ss[0]) ? true : false;
            who.Admin = "1".Equals(ss[1]) ? true : false;
            who.SupperMan = "1".Equals(ss[2]) ? true : false;
           
            //id.AddClaim(new Claim(ClaimTypes.NameIdentifier, who.Token));
            return who;
        }
        public FormTicksAuSFeature()
        {
            Display = "SF_Form_Ticks_Authentication";
        }
        public string Display
        {
            get;
            private set;
        }

        public Tuple<IEnchyma, IWho> Express(string request, IEnchyma enc, IWho who)
        {
            HttpContext context = enc["context"] as HttpContext;
            Task<IWho> t = Get(context);
            t.Wait();
            who = t.Result;
            //string web_authentication = ImmunoServer.Server.Appsetting["web_authentication_cookie"];
            //if (string.IsNullOrWhiteSpace(web_authentication)) { web_authentication = ".u"; }
            //string cookies = context.Request.Cookies[web_authentication];
            //if (string.IsNullOrWhiteSpace(cookies))
            //{
            //    who = null;
            //}
            //else
            //{
            //    who = Immuno.Authentication.WhoCacheProvider.Provider.GetByCacheKey(cookies);
            //}
            return new Tuple<IEnchyma, IWho>(enc, who);
        }
    }
}
