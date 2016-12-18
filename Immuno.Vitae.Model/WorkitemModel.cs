
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Immuno.Vitae.Model
{
    public class WorkitemModel : BaseModel
    {
        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "assign")]
        public KeyValueModel Assign { get; set; }


        [JsonProperty(PropertyName = "priority")]
        public int Priority { get; set; }

        [JsonProperty(PropertyName = "startingwork")]
        public DateTime? StartingWork { get; set; }
        [JsonProperty(PropertyName = "endingwork")]
        public DateTime? EndingWork { get; set; }

        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }


        [JsonProperty(PropertyName = "classify")]
        public int Classify { get; set; }

        [JsonProperty(PropertyName = "iteration")]
        public KeyValueModel Iteration { get; set; }

        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "tags")]
        public List<string> Tags { get; set; }


        [JsonProperty(PropertyName = "parent")]
        public KeyValueModel Parent { get; set; }

        [JsonProperty(PropertyName = "project")]
        public KeyValueModel Project { get; set; }

        [JsonProperty(PropertyName = "history")]
        public List<WorkitemHistoryModel> History { get; set; }
    }
}