using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Web
{
    public static class CorpuscleExtends
    {
        public static IEnchyma View(this ICorpuscle corpuscle, object data, string name)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "viewtemplate");
            enc.Set("template", System.IO.File.ReadAllText(name.IndexOf(":") > 0 ? name : System.IO.Path.Combine(
              ImmunoServer.Server.Appsetting["viewrootpath"], name + ".html")));
            enc.Set("response", data);
            return enc;
        }
        public static IEnchyma View(this ICorpuscle corpuscle, object data, object list, string name)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "viewtemplate");
            enc.Set("template", System.IO.File.ReadAllText(name.IndexOf(":") > 0 ? name : System.IO.Path.Combine(
               ImmunoServer.Server.Appsetting["viewrootpath"], name + ".html")));
            enc.Set("response", data);
            enc.Set("list", list);
            return enc;
        }
        public static IEnchyma File(this ICorpuscle corpuscle, string path)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "file");
            enc.Set("file", path);
            return enc;
        }

        public static IEnchyma File(this ICorpuscle corpuscle, string path,string fileName)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "file");
            enc.Set("file", path);
            enc.Set("name", fileName);
            return enc;
        }
        public static IEnchyma File(this ICorpuscle corpuscle, string path, string fileName, string contentType)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "file");
            enc.Set("contenttype", contentType);
            enc.Set("file", path);
            enc.Set("name", fileName);
            return enc;
        }
        public static IEnchyma FileContent(this ICorpuscle corpuscle, string content,string fileName)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "file");
            enc.Set("content", content);
            enc.Set("name", fileName);
            return enc;
        }

        public static IEnchyma FileContent(this ICorpuscle corpuscle, string content)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "file");
            enc.Set("content", content);
            return enc;
        }
        public static IEnchyma FileContent(this ICorpuscle corpuscle, string content, string fileName,string contentType)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "file");
            enc.Set("content", content);
            enc.Set("name", fileName);
            enc.Set("contenttype", contentType);
            return enc;
        }
        public static IEnchyma View(this ICorpuscle corpuscle, object data, object list, object bag, string name)
        {
            IEnchyma enc = new Enchyma();
            enc.Set("responseType", "viewtemplate");
            enc.Set("template", System.IO.File.ReadAllText(name.IndexOf(":") > 0 ? name : System.IO.Path.Combine(
                ImmunoServer.Server.Appsetting["viewrootpath"], name + ".html")));
            enc.Set("response", data);
            enc.Set("list", list);
            enc.Set("bag", bag);
            return enc;
        }
    }
}
