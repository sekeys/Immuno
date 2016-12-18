using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{
    public class WhoCacheDescr
    {
        public string Name { get; set; }
        public string Token { get; set; }

        public object Extends { get; set; }
        public Type Type { get; set; }

    }
}
