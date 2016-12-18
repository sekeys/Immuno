using Immuno.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Authentication;

namespace Immuno.Features
{
    public class ServerFeaureCollection
    {
        public ServerFeaureCollection()
        {
            Features = new System.Collections.Concurrent.ConcurrentDictionary<string, IServerFeature>();
        }
        private System.Collections.Concurrent.ConcurrentDictionary<string, IServerFeature> Features;
        /// <summary>
        /// 表达，
        /// </summary>
        /// <param name="enc"></param>
        /// <param name="who"></param>
        /// <returns></returns>
        public Tuple<IEnchyma, IWho> Express(string request,IEnchyma enc, IWho who)
        {
            IEnumerable<IServerFeature> features = Features.Values;
            if (enc.Contains("_servers_features"))
            {
                if (enc.Is<string>("_servers_features"))
                {
                    var _servers_features = enc.String("_servers_features").Split(';');
                    features = Features.Where(
                        m => _servers_features.Contains(m.Key)).Select(m => m.Value);
                }
                else if (enc.Is<Func<KeyValuePair<string, IServerFeature>, IEnumerable<IServerFeature>>>("_servers_features"))
                {
                    var func = enc.TypeOf<Func<IEnumerable<KeyValuePair<string, IServerFeature>>, IEnumerable<IServerFeature>>>("_servers_features");
                    features = func.Invoke(Features);
                }
            }
            foreach (var sf in features)
            {
                var t = sf.Express(request,enc, who);
                enc = t.Item1;
                who = t.Item2;
            }
            return Tuple.Create(enc, who);

        }
        /// <summary>
        /// 表达
        /// </summary>
        /// <param name="enc"></param>
        /// <param name="who"></param>
        /// <param name="filter">栓选</param>
        /// <returns></returns>
        public Tuple<IEnchyma, IWho> Express(string request,IEnchyma enc, IWho who, Func<IEnumerable<KeyValuePair<string, IServerFeature>>, IEnumerable<IServerFeature>> filter)
        {
            IEnumerable<IServerFeature> features = filter.Invoke(Features);
            foreach (var sf in features)
            {
                var t = sf.Express(request,enc, who);
                enc = t.Item1;
                who = t.Item2;
            }
            return Tuple.Create(enc, who);

        }
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="feature"></param>
        public void Regiest(IServerFeature feature)
        {
            if (Features.ContainsKey(feature.Display))
            {
                Features[feature.Display] = feature;
            }
            else
            {
                if (!Features.TryAdd(feature.Display, feature))
                {
                    throw new Exception("can't add to server features");
                }
            }
        }
        /// <summary>
        /// 反注册
        /// </summary>
        /// <param name="display"></param>
        /// <returns></returns>
        public IServerFeature Unregist(string display)
        {
            IServerFeature value = null;
            if (Features.ContainsKey(display))
            {
                Features.TryRemove(display, out value);
            }
            return value;
        }
        /// <summary>
        /// 反注册
        /// </summary>
        /// <param name="feature"></param>
        /// <returns></returns>
        public IServerFeature Unregist(IServerFeature feature)
        {
            return Unregist(feature.Display);
        }
    }
}
