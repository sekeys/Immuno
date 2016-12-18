using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Web
{
    public class ImmunoMiddleware
    {
        private RequestDelegate _next;
        public ImmunoMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            IEnchyma enchyma = new Enchyma();
            enchyma["context"] = context;
            var header = new Enchyma();
            header.Set("method", context.Request.Method);
            enchyma["header"] = header.Merge<StringValues>(context.Request.Headers);

            if (!context.Request.Method.Equals("get", StringComparison.OrdinalIgnoreCase)
                && !context.Request.Method.Equals("head", StringComparison.OrdinalIgnoreCase))
                enchyma["forms"] = new Enchyma().Merge(context.Request.Form);

            enchyma["querystring"] = new Enchyma().Merge(context.Request.Query);

            string requestPath = context.Request.Path.ToUriComponent().Trim(new char[] { '/', '\\' });

            if (string.IsNullOrWhiteSpace(requestPath))
            {
                requestPath = ImmunoServer.Server.Appsetting["defaultweb"];//"home";
            }
            if (context.Request.Cookies.Count > 0)
            {
                var cookie = new Enchyma();
                foreach (var kv in context.Request.Cookies)
                {
                    cookie.Set(kv.Key, kv.Value);
                }
                enchyma.Set("cookies", cookie);
            }
            IEnchyma enc = await ImmunoServer.Server.Serving(requestPath, enchyma);
            string wr = "";
            if (enc == null)
            {
                context.Response.StatusCode = 404;
                context.Response.Clear();
                return;
            }
            if (enc.StatusCode >= 400 && enc.StatusCode < 500)
            {
                if (context.Request.Headers["HeaderAccept"].Contains("text/html"))
                {
                    context.Response.StatusCode = 404;
                    if (string.IsNullOrWhiteSpace(ImmunoServer.Server.Appsetting["httpnotfoundpage"]))
                    {
                        wr = enc.ViewTemplate(ImmunoServer.Server.Appsetting["httpnotfoundpage"]);
                    }
                }
                else
                {
                    context.Response.StatusCode = 404;
                    context.Response.Clear();
                }
            }
            else if (enc.StatusCode > 200 && context.Request.Headers["HeaderAccept"].Contains("text/html"))
            {
                context.Response.StatusCode = enc.StatusCode;
                if (string.IsNullOrWhiteSpace(ImmunoServer.Server.Appsetting["httperrorpage"]))
                {
                    wr = enc.ViewTemplate(ImmunoServer.Server.Appsetting["httperrorpage"]);
                }
            }
            else
            {
                switch (enc.String("responseType"))
                {
                    case "json":
                        wr = enc.Json("response");
                        break;
                    case "view":
                        wr = enc.View(enc.String("template"));
                        break;
                    case "viewtemplate":
                        wr = enc.ViewTemplate(enc.String("template"));
                        break;
                    case "xml":
                        wr = enc.Xml();
                        break;
                    case "redirect":
                        wr = enc.Response.String("redirect");
                        context.Response.Redirect(wr);
                        break;
                    case "file":
                        context.Response.ContentType = "application/octet-stream";
                        //context.Response.ch = "UTF-8";
                        //Response.ContentEncoding = Encoding.UTF8;
                        //context.Response.
                        if (enc.Contains("name"))
                        {
                            context.Response.Headers.Add("Content-Disposition", "attachment; filename=" + enc.String("name"));
                        }
                        if (enc.Contains("content"))
                        {
                            wr = enc.String("content");
                        }
                        else
                        {
                            wr = System.IO.File.ReadAllText(enc.String("file"));
                        }

                        if (enc.Contains("contenttype"))
                        {
                            context.Response.ContentType = enc.String("contenttype");
                        }
                        await context.Response.WriteAsync(wr,System.Text.Encoding.UTF8);
                        return;
                    default:
                        wr = enc.Json("response");
                        break;

                }

                if (enc.Contains("contenttype"))
                {
                    context.Response.ContentType = enc.String("contenttype");
                }
                //await _next.Invoke(context);
                await context.Response.WriteAsync(wr);
            }
        }
    }
}
