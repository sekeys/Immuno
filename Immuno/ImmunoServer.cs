using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno
{
    using Nervus.Reflex;
    using Organization;
    using Authentication;

    public interface IImmunoServer
    {
        IOrganizationGroup OrgGroup { get; }

        Configuration.ConfigurationStartup Configuration { get; }

        Task<IEnchyma> Serving(string request, IEnchyma enchyma);
        Task<IEnchyma> Serving(string request, IEnchyma enchyma, IWho who);
        void Serving(Action<IOrganizationGroup> action);
        IEnchyma Serving(Func<IOrganizationGroup, IEnchyma> func);


        Task ServingAsync(Action<IOrganizationGroup> action);
        void ServingAsync(string request, IEnchyma enchyma, Action<IEnchyma> action);
        void ServingAsync(string request, IEnchyma enchyma, IWho who, Action<IEnchyma> action);
        void Prepare();
        Reflex Reflex { get; }
    }
    public class ImmunoServer : IImmunoServer
    {
        public Configuration.Appsetting Appsetting { get; private set; } = new Immuno.Configuration.Appsetting();
        private static ImmunoServer s_Server;
        private static object locker = new object();
        /// <summary>
        /// 服务
        /// </summary>
        public static ImmunoServer Server
        {
            get
            {
                if (s_Server == null)
                {
                    lock (locker)
                    {
                        s_Server = new ImmunoServer();
                    }
                }
                return s_Server;
            }
        }
        public ImmunoServer()
        {
            Configuration = new Configuration.ConfigurationStartup();
            ServerFeatures = new Features.ServerFeaureCollection();
        }
        /// <summary>
        /// 配置
        /// </summary>
        public Configuration.ConfigurationStartup Configuration
        {
            get;
            private set;
        }

        public IOrganizationGroup OrgGroup
        {
            get { return OrganizationGroup.Group; }
        }

        public Reflex Reflex
        {
            get
            {
                return Reflex.ReflexArc;
            }
        }

        public void Prepare()
        {
            try
            {

                var expands = new Immuno.Features.ExpandsRequestSFeature();
                ImmunoServer.Server.ServerFeatures.Regiest(expands);
                Configuration.Manager.Configure();
            }
            catch (Exception ex)
            {
                Immuno.Log.Logger.Log.GetInstance().Log(ex);
            }
        }

        public Features.ServerFeaureCollection ServerFeatures
        {
            get;
            private set;
        }
        public IEnchyma Serving(Func<IOrganizationGroup, IEnchyma> func)
        {
            return func.Invoke(OrgGroup);
        }

        public void Serving(Action<IOrganizationGroup> action)
        {
            action.Invoke(OrgGroup);
        }

        public async Task<IEnchyma> Serving(string request, IEnchyma enchyma)
        {
            var ret = ServerFeatures.Express(request, enchyma, null);
            if (!ret.Item1.Contains("request"))
            {
                ret.Item1["request"] = request;
            }
            return await OrgGroup.Serving(ret.Item1, ret.Item2);

        }
        public async Task<IEnchyma> Serving(string request, IEnchyma enchyma, IWho who)
        {
            return await OrgGroup.Serving( enchyma, who);
        }

        public Task ServingAsync(Action<IOrganizationGroup> action)
        {
            return Task.Run(() =>
            {
                action.Invoke(OrgGroup);
            });
        }

        public async void ServingAsync(string request, IEnchyma enchyma, Action<IEnchyma> action)
        {
            await Task.Run(async () =>
            {
                
                var ret = ServerFeatures.Express(request, enchyma, null);
                if (!ret.Item1.Contains("request"))
                {
                    ret.Item1["request"] = request;
                }
                var result = await OrgGroup.Serving(ret.Item1, ret.Item2);
                action.Invoke(result);
            });
        }
        public async void ServingAsync(string request, IEnchyma enchyma, IWho who, Action<IEnchyma> action)
        {
            await Task.Run(async () =>
            {
                var ret = ServerFeatures.Express(request, enchyma, who);
                if (!ret.Item1.Contains("request"))
                {
                    ret.Item1["request"] = request;
                }
                var result = await OrgGroup.Serving(ret.Item1, ret.Item2);
                action.Invoke(result);
            });
        }
        
    }
}
