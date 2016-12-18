

namespace Immuno.Vitae.Model
{
    using Microsoft.Azure.Documents;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    public class TypificationModel:BaseModel
    {
        [JsonProperty(PropertyName = "_type")]
        public string Type { get; set; }
        [JsonProperty(PropertyName = "label")]
        public string Label { get; set; }
        [JsonProperty(PropertyName = "value")]
        public Document Value { get; set; }
    }
}