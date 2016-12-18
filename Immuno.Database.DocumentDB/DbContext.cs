

namespace Immuno.Database.DocumentDB
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using Newtonsoft.Json;
    using System.Linq.Expressions;
    public class DbContext<T> : ContextBase<T>, IContext<T> where T : Document
    {
        public DocumentContext Context { get; set; }
        private string collectionid = "";
        private string databaseid = "";
        public string DatabaseId { get { return databaseid; } set { databaseid = value;ChangeValuesForCollectionLinks(); } }
        public string CollectionId { get { return collectionid; } set { collectionid = value; ChangeValuesForCollectionLinks(); } }
        public string CollectionLink { get; private set; }
        public DbContext<T> Connect()
        {
            Context = new DocumentContext();
            return this;
        }
        public DocumentCollection DocumentCollection(string id, RequestOptions opt = null)
        {
            return Context.ReadDocumentCollection($"dbs/{DatabaseId}/cols/{id}", opt);
        }
        public DocumentCollection DocumentCollection(string database, string id, RequestOptions opt = null)
        {
            return Context.ReadDocumentCollection($"dbs/{database}/cols/{id}", opt);
        }
        public async void Delete(T value)
        {
            await Context.Client.DeleteDocumentAsync(value.SelfLink);
        }
        protected void ChangeValuesForCollectionLinks()
        {
            CollectionLink = $"/dbs/{databaseid}/colls/{CollectionId}";
        }
        public void Delete(string id)
        {
            Document document = new Document();
            document.Id = id;
            Delete((T)document);
        }

        public IEnumerable<T> Query(FeedOptions opt = null)
        {
            return Context.Client.CreateDocumentQuery(CollectionLink,opt).Select(m=>(T)m).AsEnumerable();
        }

        public T Query(string id)
        {
            return Context.Client.CreateDocumentQuery<T>(CollectionLink).Where(m => m.Id == id).AsEnumerable().FirstOrDefault();
        }

        public IEnumerable<T> Query(Expression<Func<T, bool>> action, FeedOptions opt = null)
        {
            return Context.Client.CreateDocumentQuery<T>(CollectionLink).Where(action).AsEnumerable();
        }

        public IEnumerable<T> Query(T value, FeedOptions opt = null)
        {
            return Context.Client.CreateDocumentQuery<T>(CollectionLink,opt).AsEnumerable();
        }
        public IEnumerable<T> Query(Expression<Func<T, bool>> action, Expression<Func<T,int,T>> select, FeedOptions opt = null)
        {
            return Context.Client.CreateDocumentQuery<T>(CollectionLink).Where(action).Select(select).AsEnumerable();
        }
        public IEnumerable<T2> Query<T2>(Expression<Func<T, bool>> action, Expression<Func<T, int, T2>> select, FeedOptions opt = null)
        {
            return Context.Client.CreateDocumentQuery<T>(CollectionLink).Where(action).Select(select).AsEnumerable();
        }
        public async Task<object> QueryWithJavaScript(string script)
        {
            var collection = DocumentCollection(CollectionId);
            string javascriptFunctionSub = string.Format("function(){{ {0}; }}", script);
            string singleQuerySprocName = "query";
            StoredProcedure currStoredProcedure = this.Context.Client.CreateStoredProcedureQuery(collection.SelfLink)
                .Where(s => singleQuerySprocName.Equals(s.Id))
                .AsEnumerable()
                .FirstOrDefault();
            if (currStoredProcedure != null)
            {
                currStoredProcedure.Body = javascriptFunctionSub;
                await this.Context.Client.ReplaceStoredProcedureAsync(currStoredProcedure);
            }
            else
            {
                currStoredProcedure = await this.Context.Client.CreateStoredProcedureAsync(collection.SelfLink, new StoredProcedure
                {
                    Id = singleQuerySprocName,
                    Body = javascriptFunctionSub
                });
            }
            StoredProcedureResponse<object> result = await this.Context.Client.ExecuteStoredProcedureAsync<object>(currStoredProcedure.SelfLink);
            return result.Response;
        }

        public IEnumerable<T> QueryWithSqlSpec(string sql, FeedOptions opt = null)
        {
            var query = Context.Client.CreateDocumentQuery<T>(CollectionLink, new SqlQuerySpec()
            {
                QueryText = sql,

            }, opt);
            return query.AsEnumerable();
        }
        public IEnumerable<T> QueryWithSqlSpec(string sql, SqlParameterCollection collection, FeedOptions opt = null)
        {
            var query = Context.Client.CreateDocumentQuery<T>(CollectionLink, new SqlQuerySpec()
            {
                QueryText = sql,
                Parameters = collection
            }, opt);
            return query.AsEnumerable();
        }

        public void Replace(T value)
        {
            Context.Client.ReplaceDocumentAsync(value);
        }
        public void Merge(T value)
        {
            dynamic document = Context.ReadDocument($"{CollectionLink}/docs/" + value.Id);
            document["1"] = value;
            Upsert(document);
        }

        public void Merge(T value, Func<T,T, Document> howto)
        {
            dynamic document = Context.ReadDocument($"{CollectionLink}/docs/" + value.Id);
            Upsert(howto.Invoke(value, document));
        }
        public void Merge(string id, Func< T, Document> howto)
        {
            dynamic document = Context.ReadDocument($"{CollectionLink}/docs/" + id);
            Upsert(howto.Invoke(document));
        }
        public void Merge(T value, Func<dynamic,T, Document> howto)
        {
            dynamic document = Context.ReadDocument($"{CollectionLink}/docs/" + value.Id);
            Upsert(howto.Invoke(value, document));

        }
        public void Merge(T value, Func<dynamic, dynamic,dynamic> howto)
        {
            dynamic document = Context.ReadDocument($"{CollectionLink}/docs/" + value.Id);
            Upsert(howto.Invoke(value, document));

        }

        public void Upsert(T value)
        {
            if (value == null) { return; }
            Context.Client.UpsertDocumentAsync(value.SelfLink, value);
        }

        public void Add(T value)
        {
            Context.Client.CreateDocumentAsync(value.SelfLink,value);
        }
        public IOrderedQueryable<T> CreateQuery()
        {
            return Context.Client.CreateDocumentQuery<T>(CollectionLink);
        }

        public IOrderedQueryable<T> CreateQuery(string collection)
        {
            return Context.Client.CreateDocumentQuery<T>(collection);
        }
    }

    public class DbContext
    {

        public static DbContext<Document> CreateDbContext(string database,string documentcollection)
        {
            var context= new DbContext<Document>();
            context.CollectionId = documentcollection;
            context.DatabaseId = database;
            return context;
        }
        public static DbContext<T> CreateDbContext<T>(string database, string documentcollection) where T :Document
        {
            var context = new DbContext<T>();
            context.CollectionId = documentcollection;
            context.DatabaseId = database;
            return context;
        }
    }
}
