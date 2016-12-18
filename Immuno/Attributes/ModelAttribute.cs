using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Attributes
{
    public class ModelAttribute : ISerializableAttribute
    {
        public Type Type { get; protected set; }
        public ModelAttribute(Type type)
        {
            Type = type;
        }
        public void Deserialize(string json)
        {

        }

        public string Serialize()
        {
            throw new NotImplementedException();
        }
    }
}
