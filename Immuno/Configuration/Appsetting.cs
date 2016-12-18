using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Configuration
{
    public class Appsetting
    {
        private ConcurrentDictionary<string, string> dict = new ConcurrentDictionary<string, string>();
        public string this[string key]
        {
            get
            {
                key = key.ToLower();
                return !dict.ContainsKey(key) ? "" : dict[key];
            }
            set
            {
                key = key.ToLower();
                if (Contains(key))
                {
                    dict[key] = value;
                }
                else
                {
                    dict.TryAdd(key, value);
                }
            }
        }

        public bool Contains(string key)
        {
            return dict.ContainsKey(key.ToLower());
        }
    }
}
