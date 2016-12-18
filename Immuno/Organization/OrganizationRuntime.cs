namespace Immuno.Organization
{
    using System;
    using Scope;
    using Extends;
    using Nervus.Reflex;
    using System.Threading.Tasks;
    using Authentication;
    using System.Collections.Generic;

    public class OrganizationRuntime
    {
        public IWho Who { get; protected set; }
        public string Guid { get; protected set; }
        public OrganizationRuntime(IOrganization org, string request)
        {
            Guid = System.Guid.NewGuid().ToString();
            Organization = org;
            //Scope = new Scope.Scope(this, request);
            ScopeDescription = new ScopeDescription(this, new string[] { request });
        }
        public OrganizationRuntime(IOrganization org, string[] requests)
        {
            Guid = System.Guid.NewGuid().ToString();
            Organization = org;
            //Scope = new Scope.Scope(this, request);
            ScopeDescription = new ScopeDescription(this, requests);
        }
        public Status Status { get; set; } = Status.Prepar;

        public IOrganization Organization { get; protected set; }

        //public IScope Scope { get; protected set; }
        public ScopeDescription ScopeDescription { get; protected set; }
        public async Task<IEnchyma> Serving(IEnchyma enchyma, IWho who)
        {
            Who = who;
            if (!ScopeDescription.Multiple)
            {
                var scope = ScopeDescription.Scopes[0];
                return await Task.Run<IEnchyma>(() =>
                {
                    try
                    {
                        Reflex.ReflexArc.Stimulate($"Organization.{Organization.Code}.running", this, scope);
                        Status = Status.Running;
                        var next = scope.Next();
                        if (next == null)
                        {
                            Reflex.ReflexArc.Stimulate($"Organization.{Organization.Code}.notfound", this, scope);
                            //不抛出异常，放在enchyma返回。
                            var r = new Enchyma();
                            r.StatusCode = 404;
                            r.Result = false;
                            return r;
                        }
                        Corpuscle cor = next.Corpuscle() as Corpuscle;
                        cor.Scope = scope;
                        if (cor == null)
                        {
                            Reflex.ReflexArc.Stimulate($"Organization.{Organization.Code}.notfound", this, scope);
                            //不抛出异常，放在enchyma返回。
                            var r = new Enchyma();
                            r.Result = false;
                            r.StatusCode = 404;
                            return r;

                        }
                        cor.OrgRuntime = this;

                        return cor.Serving(enchyma);
                    }
                    catch (Exception ex)
                    {
                        Reflex.ReflexArc.Stimulate($"Organization.{Organization.Code}.exception", this, scope, ex);
                        //不抛出异常，放在enchyma返回。
                        var res = new Enchyma();
                        res.Set("result", false);
                        res.Set("message", "出现异常情况，请仔细验证");
                        res.Set("stacktrace", ex.StackTrace);
                        res.Set("exception", ex.ToString());
                        var r = new Enchyma();
                        r.Result = false;
                        r.Set("response", res);
                        return r;
                        //throw ex;
                    }
                })
                .ContinueWith<IEnchyma>((t) =>
                {
                    Status = Status.Finish;
                    Reflex.ReflexArc.Stimulate($"Organization.{Organization.Code}.Finished", this, t, scope);
                    return t.Result;
                });
            }
            else
            {
                List<Task<IEnchyma>> ts = new List<Task<IEnchyma>>();
                foreach (var scope in ScopeDescription.Scopes)
                {
                    if (scope == null) { continue; }
                    ts.Add(new Task<IEnchyma>(() =>
                    {
                        try
                        {
                            Reflex.ReflexArc.Stimulate($"Organization.{Organization.Code}.mulrunning", this, scope);
                            Status = Status.Running;
                            var next = scope.Next();
                            Corpuscle cor = next.Corpuscle() as Corpuscle;
                            cor.Scope = scope;
                            if (cor == null)
                            {
                                throw new Exception();
                            }
                            cor.OrgRuntime = this;
                            return cor.Serving(enchyma);
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }));
                }
                var encs = await Task.WhenAll<IEnchyma>(ts);
                return ScopeDescription.CompletedFunc.Invoke(encs);
            }
        }
    }
}
