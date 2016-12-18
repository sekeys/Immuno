

namespace Immuno
{
    using System;
    using Immuno.Features;
    using Immuno.Filration;
    using Immuno.Gene;
    using Organization;
    using Exceptions;
    using Immuno.Organization.Extends;
    using System.Reflection;
    using System.Linq;
    using Attributes;
    using System.Threading.Tasks;
    using Organization.Scope;

    public abstract class Corpuscle : ICorpuscle
    {
        public IScope Scope { get; set; }
        public IEnchyma Response(object data, int statuscode, string message = "",string responseType="json")
        {
            IEnchyma enchyma = new Enchyma();
            IEnchyma response = new Enchyma();
            if (data != null) response["d"] = data;
            response["status"] = statuscode;
            response["result"] = statuscode <= 200 ? true : false;
            response["message"] = message;
            enchyma["response"] = response;
            enchyma.Set("responseType", responseType);
            return enchyma;
        }
        
        public IEnchyma Response(object data)
        {
            return Response(data, 200);
        }
        public IEnchyma ResponseFailed(string message)
        {
            return Response(null, 300, message);
        }
        public IEnchyma ResponseFailed(int status, string message)
        {
            return Response(null, status, message);
        }

        public virtual string Text { get; protected set; }
        public IFiltration Filtration
        {
            get;
            protected set;
        }

        public virtual IGene Gene
        {
            get;
            protected set;
        }

        public ICorpuscle Original
        {
            get;
            protected set;
        }

        public OrganizationRuntime OrgRuntime
        {
            get;
            internal protected set;
        }

        public virtual void Adhere(GeneFeatureCollection features)
        {
            foreach (var item in features)
            {
                Gene.Register((GeneFeature)item.Value);
            }
        }
        public virtual void Adhere(GeneFeature feature)
        {
            Gene.Register(feature);
        }

        public virtual void Inherit(ICorpuscle corpuscle, GeneFeatureCollection features)
        {
            Original = corpuscle;
            foreach (var item in features)
            {
                Gene.Register((GeneFeature)item.Value);
            }
            foreach (var item in corpuscle.Gene.Features)
            {
                Gene.Register((GeneFeature)item.Value);
            }
        }
        public virtual void Inherit(ICorpuscle corpuscle, GeneFeature feature)
        {
            Gene.Register(feature);
            foreach (var item in corpuscle.Gene.Features)
            {
                Gene.Register((GeneFeature)item.Value);
            }
        }
        public virtual void Inherit(ICorpuscle corpuscle)
        {
            foreach (var item in corpuscle.Gene.Features)
            {
                Gene.Register((GeneFeature)item.Value);
            }
        }

        public virtual ICorpuscle Mutate(Func<ICorpuscle, ICorpuscle> func)
        {
            return func.Invoke(this);
        }
        public virtual ICorpuscle Mutate(Type corpuscleType, GeneFeature features)
        {
            ICorpuscle corpuscle = System.Activator.CreateInstance(corpuscleType) as ICorpuscle;
            corpuscle.Inherit(this, features);
            return corpuscle;
        }
        public virtual ICorpuscle Mutate(Type corpuscleType, GeneFeatureCollection features)
        {
            ICorpuscle corpuscle = System.Activator.CreateInstance(corpuscleType) as ICorpuscle;
            corpuscle.Inherit(this, features);
            return corpuscle;
        }

        public virtual IEnchyma Next(IEnchyma enchyma)
        {
            var ch = Scope.Next();
            var cor = ch.Corpuscle();
            cor.OrgRuntime = this.OrgRuntime;
            if (cor == null)
            {
                throw new Exception("can't found the corpuscle");
            }
            Trigger.Trigger.Instance.Invoke(this, enchyma);
            return cor.Serving(enchyma);
        }

        public virtual IEnchyma Serving(IEnchyma enchyma)
        {
            try
            {
                var filterIn = Filtration == null ? enchyma : Filtration.In(enchyma);
                //实体分化
                if (Gene != null) Gene.Expresse(filterIn);

                Trigger.Trigger.Instance.Invoke(this, enchyma);
                filterIn = ServingCore(filterIn);
                if (Scope.CanNext())
                {
                    filterIn = Next(filterIn);
                }
                return Filtration == null ? filterIn : Filtration.Out(filterIn);
            }
            catch (IgnoreException<IEnchyma> ex)
            {
                //便与栓选器等进行中断操作，返回特定的结果集
                return ex.Tag;
            }
            catch (Exception ex)
            {
                Immuno.Nervus.Reflex.Reflex.ReflexArc.Stimulate("exception.corpuscle", ex);
                throw ex;
            }
        }
        protected abstract IEnchyma ServingCore(IEnchyma enchyma);

    }

    public abstract class Corpuscle<T> : Corpuscle
    {
        protected T Server { get; set; }
    }
    public class RESTCorpuscle : Corpuscle
    {
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            var header = enchyma.TypeOf<IEnchyma>("header");
            var method = header.String("method");
            Type type = this.GetType();
            var methods = type.GetTypeInfo().GetMethods().Where(m =>
            {
                var result = m.Name.Equals(method, StringComparison.OrdinalIgnoreCase);
                if (result) { return result; }
                var attr = m.GetCustomAttribute(typeof(VerbAttribute));
                if (attr == null) { return false; }
                if (((VerbAttribute)attr).Verb.ToString().Equals(method, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
                return false;
            }).FirstOrDefault();
            if (methods == null)
            {
                throw new Exception("can't found this method,can't proccess it");
            }
            if (methods.ReturnType.IsAssignableFrom(typeof(Task<IEnchyma>)))
            {
                var t = methods.Invoke(this, new object[] { enchyma }) as Task<IEnchyma>;
                t.Wait();
                return t.Result;
            }
            else
            {
                return methods.Invoke(this, new object[] { enchyma }) as IEnchyma;
            }

        }
    }

    public class RESTCorpuscle<T> : RESTCorpuscle, ICorpuscle<T>
    {
        public T Server { get; protected set; }
        public RESTCorpuscle(T server)
        {
            Server = server;
        }
    }
}
