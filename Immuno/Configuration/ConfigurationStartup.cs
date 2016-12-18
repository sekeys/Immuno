
namespace Immuno.Configuration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Features;
    using Microsoft.Extensions.Configuration;
    using Organization.Scope;
    using System.Reflection;
    using Organization;
    public class ConfigurationStartup : IConfigurationStartup
    {

        public int Priority { get; set; } = 0;
        public ConfigurationManager Manager { get { return ConfigurationManager.Manager; } }
        public static string RootConfigurePath { get; set; }
        protected string m_ConfigurePath;
        public string ConfigurePath
        {
            get
            {
                if (string.IsNullOrWhiteSpace(m_ConfigurePath)) { return RootConfigurePath; }
                return m_ConfigurePath;
            }
            set { m_ConfigurePath = value; }
        }
        public IConfiguration Section { get; set; }

        public string UnionCode
        {
            get;
            private set;
        }

        public IConfigurationStartup Parent
        {
            get;
            set;
        } = null;


        public IConfigurationStartup Original
        {
            get;
            set;
        } = null;

        public ConfigurationStartup()
        {
            var cb = new ConfigurationBuilder();
            Section = cb.AddJsonFile(ConfigurePath, true, true).Build();
            UnionCode = Section.GetSection("unioncode").Value;
            if (Manager.Startups.ContainsKey(this.UnionCode))
            {
                Manager.Startups[this.UnionCode] = this;
            }
            else
            {
                Manager.Startups.Add(this.UnionCode, this);
            }
            BuildConfigureStartup();

        }

        public ConfigurationStartup(string configpath)
        {
            m_ConfigurePath = configpath;
            var cb = new ConfigurationBuilder();
            Section = cb.AddJsonFile(ConfigurePath, true, true).Build();
            UnionCode = Section.GetSection("unioncode").Value;
            Manager.Startups.Add(this.UnionCode, this);
            if (Manager.Startups.ContainsKey(this.UnionCode))
            {
                Manager.Startups[this.UnionCode] = this;
            }
            else
            {
                Manager.Startups.Add(this.UnionCode, this);
            }
            BuildConfigureStartup();

        }
        /// <summary>
        /// Build Configure Starup
        /// </summary>
        public void BuildConfigureStartup()
        {
            IConfigurationSection startupSection = Section.GetSection("startups");
            object obj = null;
            IConfigurationStartup cs = null;
            foreach (var section in startupSection.GetChildren())
            {
                var assemlySection = section.GetSection("assemly");
                var typeSection = section.GetSection("type");
                var pathSection = section.GetSection("path");
                if (assemlySection == null && assemlySection.Value==null && pathSection == null)
                {
                    continue;
                }
                else if ((assemlySection == null|| assemlySection.Value==null )&& pathSection != null && pathSection.Value != null)
                {
                    cs = new ConfigurationStartup(pathSection.Value);
                    
                }
                else
                {
                    var ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemlySection.Value);
                    var type = ass.GetType(typeSection.Value);
                    obj = System.Activator.CreateInstance(type);
                }
                if (obj is IConfigurationStartup)
                {
                    cs = obj as IConfigurationStartup;
                }
                else if (obj is IConfigurationSectionStartup)
                {
                    cs = obj as IConfigurationSectionStartup;
                    cs.Parent = this;
                    cs.Section = Section.GetSection(section.GetSection("section").Value);
                }
                var prioritySection = section.GetSection("priority");
                if (prioritySection == null)
                {
                    cs.Priority = 1000;
                }
                else
                {
                    cs.Priority = Convert.ToInt32(prioritySection.Value);
                }
                cs.Original = this;
                //cs.BuildConfigureStartup();
                //if (Manager.Startups.ContainsKey(cs.UnionCode))
                //{
                //    Manager.Startups[cs.UnionCode] = cs;
                //}
                //else
                //{
                //    Manager.Startups.Add(cs.UnionCode, cs);
                //}
            }
        }

        public void Configure()
        {
            BuildAppsetting();
            BuildServer();
            //BuildConfigureStartup();

            var orgSection = Section.GetSection("organizations");
            BuildOrgs(orgSection);

        }
        /// <summary>
        /// 初始化Appsetting配置
        /// </summary>
        public void BuildAppsetting()
        {
            var aps = Section.GetSection("appsettings");
            foreach (ConfigurationSection cs in aps.GetChildren())
            {
                if ("viewrootpath".Equals(cs.Key, StringComparison.OrdinalIgnoreCase))
                {
                    ImmunoServer.Server.Appsetting[cs.Key] = cs.Value.Replace("~", ImmunoServer.Server.Appsetting["hostdir"]);
                }
                else
                {
                    ImmunoServer.Server.Appsetting[cs.Key] = cs.Value;
                }
            }
        }





        /// <summary>
        /// Build Org
        /// </summary>
        /// <param name="section"></param>
        protected void BuildOrgs(IConfigurationSection section)
        {
            string type = "";
            string assemly = "";
            string where = "";
            IOrganization org = null;
            Type orgType = typeof(IOrganization);
            Assembly ass = null;

            foreach (var item in section.GetChildren())
            {

                #region ORG
                org = null;
                //build Organization
                type = item["type"];
                assemly = item["assemly"];
                string text = item["display"];

                foreach (var itemOrg in OrganizationGroup.Group.Organizations)
                {
                    if (itemOrg.Code.Equals(text))
                    {
                        org = itemOrg;
                    }
                }
                if (org == null)
                {
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (assemly.StartsWith("~"))
                        {
                            assemly = assemly.Replace("~", AppContext.BaseDirectory.TrimEnd(new char[] { '/', '\\' }));
                        }
                        where = item["where"];
                        if ("local".Equals(where))
                        {
                            ass = AppDomain.CurrentDomain.GetAssemblies().Where(m => !m.IsDynamic && m.GetName().Equals(assemly))
                                .FirstOrDefault();
                        }
                        else
                        {
                            ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemly);
                        }
                        org = Construct(ass, orgType, item);
                    }
                    else
                    {
                        org = new Organization(item["display"]);
                    }

                    if (org == null)
                    {
                        throw new Exception($"unload the organization {item["assemly"]}");
                    }

                    //给organization的root chain 赋值feature
                    OrganizationGroup.Group.Register(org);
                }
                #endregion

                #region Feature
                var featureSection = item.GetSection("features");
                IFeature feature = null;
                foreach (var featureItem in featureSection.GetChildren())
                {
                    string operate = featureItem["operate"];
                    if ("remove".Equals(operate))
                    {
                        org.Chain.Unregister(featureItem["display"]);
                    }
                    else
                    {
                        feature = BuildFeature(featureItem);

                        if (feature != null && feature is IExpressFeature<RawChain>)
                        {
                            org.Chain.Register((IExpressFeature<RawChain>)feature);
                        }
                    }
                }
                #endregion
                //创建Chain
                BuildChain(org.Chain, item.GetSection("chain"));

            }
        }
        /// <summary>
        /// 创建Feature
        /// </summary>
        /// <param name="section"></param>
        /// <returns></returns>
        protected IFeature BuildFeature(IConfigurationSection section)
        {
            string type = section["type"];
            string assemly = section["assemly"];
            string where = section["where"];
            Type typeChain = typeof(IFeature);
            Assembly ass = null;
            IFeature feature = null;
            if (assemly.StartsWith("~"))
            {
                assemly = assemly.Replace("~", AppContext.BaseDirectory.TrimEnd(new char[] { '/', '\\' }));
            }
            if (!string.IsNullOrWhiteSpace(type))
            {
                if ("local".Equals(where))
                {
                    ass = AppDomain.CurrentDomain.GetAssemblies().Where(m => !m.IsDynamic && m.GetName().Equals(assemly))
                        .FirstOrDefault();
                }
                else
                {
                    ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemly);
                }
                feature = System.Activator.CreateInstance(
                     ass.GetTypes().Where(m => m.GetTypeInfo().IsClass && typeChain.IsAssignableFrom(m)).FirstOrDefault()) as IFeature;

            }
            return feature;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="chain"></param>
        /// <param name="parent"></param>
        protected void BuildChain(IChain chain, IConfigurationSection parent)
        {
            if (parent == null)
            {
                return;
            }
            foreach (var section in parent.GetChildren())
            {
                if (section == null)
                {
                    continue;
                }
                string text = section["text"];

                IChain nextChain = chain.Nexts.Where(m => m.Text.Equals(text, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                if (nextChain == null)
                {
                    string type = section["type"];
                    string assemly = section["assemly"];
                    string where = section["where"];
                    Type typeChain = typeof(IChain);
                    Assembly ass = null;

                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (assemly.StartsWith("~"))
                        {
                            assemly = assemly.Replace("~", AppContext.BaseDirectory.TrimEnd(new char[] { '/', '\\' }));
                        }
                        if ("local".Equals(where))
                        {
                            ass = AppDomain.CurrentDomain.GetAssemblies().Where(m => !m.IsDynamic && m.GetName().Equals(assemly))
                                .FirstOrDefault();
                        }
                        else
                        {
                            ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemly);
                        }
                        nextChain = System.Activator.CreateInstance(
                             ass.GetTypes().Where(m => m.GetTypeInfo().IsClass && typeChain.IsAssignableFrom(m)).FirstOrDefault(), section["text"]) as IChain;

                    }
                    else
                    {
                        nextChain = new Chain(text);
                    }
                    if (nextChain == null)
                    {
                        throw new Exception($"unload the chain type {section["assemly"]}.{section["type"]}");
                    }

                    chain.Insert(nextChain);


                }

                #region Features
                //给chain 赋值feature
                var featureSection = section.GetSection("features");
                IFeature feature = null;
                foreach (var featureItem in featureSection.GetChildren())
                {
                    string operate = featureItem["operate"];
                    if ("remove".Equals(operate))
                    {
                        nextChain.Unregister(featureItem["display"]);
                    }
                    else
                    {
                        feature = BuildFeature(featureItem);

                        if (feature != null && feature is IExpressFeature<RawChain>)
                        {
                            nextChain.Register((IExpressFeature<RawChain>)feature);
                        }
                    }
                }
                #endregion
                //bind target corpscle  cache

                Type corpuscleType = BuildCorpuscle(section.GetSection("corpuscle"));
                if (corpuscleType != null)
                {
                    var obj = System.Activator.CreateInstance(corpuscleType);
                    var ty = corpuscleType.GetProperty("Text").GetValue(obj).ToString();
                    #region Build Trigger On Corpuscle
                    var triggerSection = section.GetSection("triggers");
                    if (triggerSection != null)
                    {
                        Trigger.ITrigger trigger = null;
                        foreach (var item in triggerSection.GetChildren())
                        {
                            string operate = item["operate"];
                            string code = item["code"];
                            if ("remove".Equals(operate))
                            {
                                Trigger.Trigger.Instance.Remove(code);
                            }
                            else
                            {
                                trigger = BuildTriggerOnCorpuscle(item, code);
                                trigger.Mode = Trigger.TriggerMode.OnText;
                                if (string.IsNullOrWhiteSpace(trigger.OnText))
                                {
                                    trigger.OnText = ty;
                                }
                            }

                        }
                    }
                    #endregion
                    ScopeTypeCacheProvider.Provider.Save($"{chain.Organization.Code}-{ty}", corpuscleType);
                }

                var nexts = section.GetSection("next");
                foreach (var item in nexts.GetChildren())
                {
                    BuildChain(nextChain, item);
                }
            }
        }
        protected Trigger.ITrigger BuildTriggerOnCorpuscle(IConfigurationSection section, string code)
        {

            if (section == null)
            {
                return null;
            }
            string type = section["type"];
            string assemly = section["assemly"];
            string where = section["where"];
            Trigger.ITrigger trigger = null;
            Assembly ass = null;
            if (assemly.StartsWith("~"))
            {
                assemly = assemly.Replace("~", AppContext.BaseDirectory.TrimEnd(new char[] { '/', '\\' }));
            }
            if (!string.IsNullOrWhiteSpace(type))
            {
                if ("local".Equals(where))
                {
                    var asses = System.AppDomain.CurrentDomain.GetAssemblies();
                    string basedir = System.AppDomain.CurrentDomain.BaseDirectory;
                    ass = asses.Where(m => !m.IsDynamic && m.GetName().Equals(assemly))
                        .FirstOrDefault();
                }
                else
                {
                    ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemly);
                }
                if (ass == null)
                {
                    trigger = System.Activator.CreateInstance(Type.GetType(type)) as Trigger.ITrigger;
                }

                trigger = System.Activator.CreateInstance(ass.GetType(type)) as Trigger.ITrigger;
                //ass.GetTypes().Where(m => m.GetTypeInfo().IsClass && typeCorpuscle.IsAssignableFrom(m)
                // &)
                //.FirstOrDefault();

            }
            trigger.Code = code;
            if (trigger != null)
            {
                Trigger.Trigger.Instance.Add(trigger);
            }
            string ontext = section["ontext"];
            if (!string.IsNullOrWhiteSpace(ontext))
            {
                trigger.OnText = ontext;
            }
            return trigger;
        }
        protected Type BuildCorpuscle(IConfigurationSection section)
        {
            if (section == null)
            {
                return null;
            }
            string type = section["type"];
            string assemly = section["assemly"];
            string where = section["where"];
            Type typeCorpuscle = typeof(ICorpuscle);
            Assembly ass = null;
            if (assemly.StartsWith("~"))
            {
                assemly = assemly.Replace("~", AppContext.BaseDirectory.TrimEnd(new char[] { '/', '\\' }));
            }

            if (!string.IsNullOrWhiteSpace(type))
            {
                if ("local".Equals(where))
                {
                    var asses = System.AppDomain.CurrentDomain.GetAssemblies();
                    string basedir = System.AppDomain.CurrentDomain.BaseDirectory;
                    ass = asses.Where(m => !m.IsDynamic && m.GetName().Equals(assemly))
                        .FirstOrDefault();
                }
                else
                {
                    ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemly);
                }
                if (ass == null)
                {
                    return Type.GetType(type);
                }

                return ass.GetType(type);
                //ass.GetTypes().Where(m => m.GetTypeInfo().IsClass && typeCorpuscle.IsAssignableFrom(m)
                // &)
                //.FirstOrDefault();

            }
            return null;
        }
        protected IOrganization Construct(Assembly ass, Type orgType, IConfigurationSection item)
        {
            if (ass != null)
            {

                var tempType = ass.GetTypes().Where(m => m.GetTypeInfo().IsClass && orgType.IsAssignableFrom(m)
                ).FirstOrDefault();
                var cons = tempType.GetConstructors()[0];
                var consparam = cons.GetParameters();
                if (consparam == null || consparam.Count() == 0)
                {
                    return System.Activator.CreateInstance(tempType) as IOrganization;
                }
                else if (consparam.Count() == 1 && consparam.ElementAt(0).ParameterType == typeof(string))
                {
                    return System.Activator.CreateInstance(tempType, item["display"]) as IOrganization;
                }
            }
            return null;
        }

        /// <summary>
        /// 创建ServerFeature
        /// </summary>
        /// <param name="section"></param>
        /// <returns></returns>
        protected IServerFeature BuildServerFeature(IConfigurationSection section)
        {

            string type = section["type"];
            string assemly = section["assemly"];
            string where = section["where"];
            Type typeFeature = typeof(IServerFeature);
            Assembly ass = null;
            IServerFeature feature = null;
            if (assemly.StartsWith("~"))
            {
                assemly = assemly.Replace("~", AppContext.BaseDirectory.TrimEnd(new char[] { '/', '\\' }));
            }
            if (!string.IsNullOrWhiteSpace(type))
            {
                if ("local".Equals(where))
                {
                    ass = AppDomain.CurrentDomain.GetAssemblies().Where(m => !m.IsDynamic && m.GetName().Equals(assemly))
                        .FirstOrDefault();
                }
                else
                {
                    ass = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemly);
                }
                feature = System.Activator.CreateInstance(
                     ass.GetTypes().Where(m => m.GetTypeInfo().IsClass && typeFeature.IsAssignableFrom(m) && m.FullName.Equals(type, StringComparison.OrdinalIgnoreCase)).FirstOrDefault()) as IServerFeature;

            }
            return feature;
        }

        protected void BuildServer()
        {
            var section = Section.GetSection("serverfeatures");
            if (section == null)
            {
                return;
            }
            IServerFeature sf = null;
            foreach (var s in section.GetChildren())
            {
                string operate = section["operate"];
                if ("remove".Equals(operate))
                {
                    string tag = section["tag"];
                    Immuno.ImmunoServer.Server.ServerFeatures.Unregist(tag);
                }
                else
                {
                    sf = BuildServerFeature(s);
                    if (sf != null) ImmunoServer.Server.ServerFeatures.Regiest(sf);
                }
            }
        }

    }
}
