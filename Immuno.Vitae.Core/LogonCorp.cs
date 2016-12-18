namespace Immuno.Vitae.Core
{
    using Immuno;
    using Microsoft.AspNetCore.Http;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Immuno.Database.DocumentDB;
    public class LogonCorp : Immuno.RESTCorpuscle
    {
        public LogonCorp()
        {
            Text = "logon";
        }

        public IEnchyma POST(IEnchyma enc)
        {
            var resp = new Enchyma();
            var res = new Enchyma();
            var req = enc.TypeOf<IEnchyma>("forms");
            //Immuno.Database
            var document = DbContext.CreateDbContext("Vitae", "UserCredentials").Connect()
                    .QueryWithSqlSpec($"SELECT * FROM UserCredentials WHERE UserCredentials.username='{req.StringEx("u")}' and UserCredentials.password='{req.StringEx("p")}'").FirstOrDefault();
            if (document != null)
            {
                res.StatusCode = 200;
                res.Result = true;
                string face = document.GetPropertyValue<string>("face");
                string signature = document.GetPropertyValue<string>("signature");
                string alias = document.GetPropertyValue<string>("alias");
                string id = document.Id;

                res.Set("n", document.GetPropertyValue<string>("alias"));
                res.Set("signature", document.GetPropertyValue<string>("signature")??"");
                res.Set("face",face );

                HttpContext context = enc["context"] as HttpContext;
                context.Response.Cookies.Append("f", face??"");
                context.Response.Cookies.Append("n", alias);
                var who = new Immuno.Web.Authentication.WebAuthenticationWho(id, req.StringEx("u"));

                if (req.BooleanEx("r"))
                {
                    Immuno.Web.Authentication.FormTicksAuSFeature.SignIn(context, who, 7);
                }
                else
                {
                    Immuno.Web.Authentication.FormTicksAuSFeature.SignIn(context, who);
                }
                who.ExtendObject = new { alias = face, levels = "", vip = 0 };


            }
            else
            {
                res.Result = false;
                res.StatusCode = 510;
                res.Set("message", "登陆失败，请重新输入正确的正好密码");

            }
            resp.Result = res.Result;
            resp.StatusCode = res.StatusCode;
            resp.Set("response", res);
            res.Set("status", resp.StatusCode);
            res.Set("result", resp.Result);
            resp.Set("responseType", "json");
            return resp;
        }
    }
}
