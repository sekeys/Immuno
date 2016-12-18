using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Web
{
    public static class EnchymaExtends
    {
        public static string Execute(this IEnchyma enchyma)
        {
            if (enchyma.Contains("response") && enchyma["response"] is Func<string>)
            {
                return ((Func<string>)enchyma["response"]).Invoke();
            }
            return null;
        }
        public static string Execute<T>(this IEnchyma enchyma, T t)
        {
            if (enchyma.Contains("response") && enchyma["response"] is Func<T, string>)
            {
                return ((Func<T, string>)enchyma["response"]).Invoke(t);
            }
            return null;
        }

        public static string Execute<T, T1>(this IEnchyma enchyma, T t, T1 t1)
        {
            if (enchyma.Contains("response") && enchyma["response"] is Func<T, T1, string>)
            {
                return ((Func<T, T1, string>)enchyma["response"]).Invoke(t, t1);
            }
            return null;
        }

        public static string Execute<T, T1, T2>(this IEnchyma enchyma, T t, T1 t1, T2 t2)
        {
            if (enchyma.Contains("response") && enchyma["response"] is Func<T, T1, T2, string>)
            {
                return ((Func<T, T1, T2, string>)enchyma["response"]).Invoke(t, t1, t2);
            }
            return null;
        }

        public static string Execute<T, T1, T2, T3>(this IEnchyma enchyma, T t, T1 t1, T2 t2, T3 t3)
        {
            if (enchyma.Contains("response") && enchyma["response"] is Func<T, T1, T2, T3, string>)
            {
                return ((Func<T, T1, T2, T3, string>)enchyma["response"]).Invoke(t, t1, t2, t3);
            }
            return null;
        }

        public static string View(this IEnchyma enchyma)
        {
            if (!enchyma.Contains("response")) { return null; }

            if (enchyma["response"] is Func<string>)
            {
                return ((Func<string>)enchyma["response"]).Invoke();
            }

            return enchyma.String("response");
        }
        public static string View(this IEnchyma enchyma, string template)
        {
            var list = "null";
            if (enchyma.Contains("list"))
            {
                list = enchyma.Json("list");
            }
            var bag = "null";
            if (enchyma.Contains("bag"))
            {
                bag = enchyma.Json("bag");
            }
            string json = $"<script>var immuno={{}}; \r\nimmuno.model={enchyma.Response.Json()};\r\nimmuno.list={list};\r\nimmuno.bag={bag};\r\n</script>\r\n";
            
            return json + template;
        }
        public static string ViewTemplate(this IEnchyma enchyma, string template)
        {
            var list = "null";
            if (enchyma.Contains("list"))
            {
                list = enchyma.Json("list");
            }
            var bag = "null";
            if (enchyma.Contains("bag"))
            {
                bag = enchyma.Json("bag");
            }
            string json = $"<script>var immuno={{}};\r\n immuno.model={enchyma.Json("response")};\r\nimmuno.list={list};\r\nimmuno.bag={bag};\r\n</script>\r\n";

            return template.Replace("<%ModelScript%>", json) ;
        }
    }
}
