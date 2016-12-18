using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Database.DocumentDB
{
    public interface IContext<T>:IQuery<T>,INonQuery<T> where T : Document
    {
        DocumentContext CreateContext();
        DocumentContext CreateContext(string uri, string authkey);
        
         
    }
}
