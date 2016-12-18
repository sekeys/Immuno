
using Microsoft.Azure.Documents;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Immuno.Vitae.Model
{
    public class BaseModel:Document
    {
        private string id;
        [JsonProperty(PropertyName = "id")]
        public override string Id
        {
            get
            {
                return ModelIDHelper.DecodeBase64(id);
            }
            set
            {
                id = ModelIDHelper.EncodeBase64(id);
            }
        }
    }
}