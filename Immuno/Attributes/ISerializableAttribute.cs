using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Attributes
{
    public interface ISerializableAttribute
    {
        string Serialize();
        void Deserialize(string json);
    }
}
