using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Gene
{
    /// <summary>
    /// 权限验证
    /// 数据处理
    /// </summary>
    public class Gene : IGene
    {
        public GeneFeatureCollection Features
        {
            get;
            protected set;
        }

        public ICorpuscle Corpuscle
        {
            get;
            internal protected set;
        }

        public void Expresse(IEnchyma enchyma)
        {
            if (Features == null) { throw new Exception(""); }
            Features.Express(enchyma);
        }

        public void Register(GeneFeature feature)
        {
            Require.NotNull(feature);
            Features.Add(feature);
        }

        public void UnRegister(GeneFeature feature)
        {
            Require.NotNull(feature);
            Features.Remove(feature.Display);
        }

        public void Reset()
        {
            Features.Clear();
        }


    }
}
