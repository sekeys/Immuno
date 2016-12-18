using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Database.DocumentDB.Appsettings
{
    public class Appsettings
    {
        private System.Collections.Concurrent.ConcurrentDictionary<string, string> appsettings { get;  set; } = new System.Collections.Concurrent.ConcurrentDictionary<string, string>();
        public string this[string key]
        {
            get
            {
                if (appsettings.ContainsKey(key))
                {
                    return appsettings[key];
                }
                return string.Empty;
            }
            set
            {
                if (appsettings.ContainsKey(key))
                {
                    appsettings[key] = value;
                }
                else
                {
                    appsettings.TryAdd(key, value);
                }
            }
        }
        public string Remove(string key)
        {
            string va = string.Empty;
            if (appsettings.ContainsKey(key))
            {
                appsettings.TryRemove(key,out va);
            }
            return va;
        }
    }
}
