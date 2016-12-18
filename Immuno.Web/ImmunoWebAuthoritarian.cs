using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Web
{
    public class ImmunoWebAuthoritarian
    {
        public static void SignIn(HttpContext context, string schema, string token)
        {
            context.Authentication.SignInAsync(schema, new System.Security.Claims.ClaimsPrincipal(
                new Immuno.Authentication.Who(token)));
        }
        public static void SignIn(HttpContext context, string schema, Immuno.Authentication.Who who)
        {
            context.Authentication.SignInAsync(schema, new System.Security.Claims.ClaimsPrincipal(
               who));
        }
        public async static void GetAuthenticateInfo(HttpContext context,string schema)
        {
           //var ai=context.Authentication.GetAuthenticationSchemes();
           // ai.ElementAt(0).
           // var id = ai.Principal.Identity;
        }
    }
}
