using Microsoft.Azure.Documents;
using Newtonsoft.Json;
using System;

namespace Immuno.Vitae.Model
{
    public class KeyValueModel : BaseModel
    {

        [JsonProperty(PropertyName = "label")]
        public string Label { get; set; }

    }
}
