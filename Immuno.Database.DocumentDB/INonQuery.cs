using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Database.DocumentDB
{
    public interface INonQuery<T> where T : Document
    {
        void Delete(string id);
        void Delete(T value);
        void Replace(T value);

    }
}
