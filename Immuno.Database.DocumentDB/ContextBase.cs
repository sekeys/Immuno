using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Database.DocumentDB
{
    public abstract class ContextBase<T>
    {

        public DocumentContext CreateContext()
        {
            return new DocumentContext();

        }
        public DocumentContext CreateContext(string uri, string authkey)
        {
            return new DocumentContext(uri, authkey);
        }
    }
}
