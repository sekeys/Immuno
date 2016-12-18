
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Immuno.Vitae.Model
{
    public class WorkitemHistoryModel:BaseModel
    {

        [JsonProperty(PropertyName = "date")]
        public DateTime Date { get; set; }

        [JsonProperty(PropertyName = "content")]
        public string Content { get; set; }


        [JsonProperty(PropertyName = "who")]
        public KeyValueModel Who { get; set; }

        [JsonProperty(PropertyName = "operate")]
        public string Operate { get; set; }

    }
}