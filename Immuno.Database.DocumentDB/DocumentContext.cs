

namespace Immuno.Database.DocumentDB
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using Microsoft.Azure.Documents.Linq;
    public class DocumentContext:IDisposable
    {

        public static Uri Endpoint { get; set; }
        public static string AuthKeyOrResourceToken { get; set; }
        public static ConnectionPolicy ConnectionPolicy { get; set; } = null;
        public Microsoft.Azure.Documents.Client.DocumentClient Client;
        public DocumentContext()
        {
            Client = new DocumentClient(Endpoint, AuthKeyOrResourceToken, ConnectionPolicy);
        }
        public DocumentContext(Uri endpoint, string authkey)
        {
            Client = new DocumentClient(endpoint, authkey);
        }
        public DocumentContext(string endpoint, string authkey)
        {
            Client = new DocumentClient(new Uri(endpoint), authkey);
        }
        public void ReConnect(string endpoint, string authkey)
        {
            Client = new DocumentClient(new Uri(endpoint), authkey);
        }
        public void ReConnect(Uri endpoint, string authkey)
        {
            Client = new DocumentClient(endpoint, authkey);
        }
        public IEnumerable<Database> QueryDatabase(Func<Database, bool> action)
        {
            return Client.CreateDatabaseQuery().Where(action);
        }
        public IEnumerable<Database> QueryDatabase(Database value)
        {
            return new List<Database>() { QueryDatabase(value.Id) };
        }
        public IEnumerable<Database> QueryDatabase()
        {
            string continuation = null;
            List<Database> databases = new List<Database>();
            do
            {
                FeedOptions opt = new FeedOptions
                {
                    RequestContinuation = continuation,
                    MaxItemCount = 50
                };
                var response = Client.ReadDatabaseFeedAsync(opt);
                response.Wait();
                foreach (Database db in response.Result)
                {
                    databases.Add(db);
                }
                continuation = response.Result.ResponseContinuation;
            }
            while (!string.IsNullOrWhiteSpace(continuation));
            return databases;
        }

        public Database QueryDatabase(string id)
        {
            return Client.CreateDatabaseQuery().Where(db => db.Id == id).AsEnumerable().FirstOrDefault();
        }

        public async Task<ResourceResponse<Database>> DeleteAndGetDatabase(string databaselink)
        {
            return await Client.DeleteDatabaseAsync(databaselink);

        }
        public async void DeleteDatabase(string databaselink)
        {
            await Client.DeleteDatabaseAsync(databaselink);

        }

        public async Task<ResourceResponse<Database>> ReadDatabaseAsync(string dbLink, RequestOptions opt = null)
        {
            return await Client.ReadDatabaseAsync(dbLink, opt);
        }
        public async Task<FeedResponse<Database>> ReadDatabaseAFeedsync(FeedOptions opt = null)
        {
            return await Client.ReadDatabaseFeedAsync(opt);
        }

        public Database ReadDatabase(string dbLink, RequestOptions opt = null)
        {
            var task = Client.ReadDatabaseAsync(dbLink, opt);
            task.Wait();
            return task.Result.Resource;
        }

        public DocumentCollection ReadDocumentCollection(string collectionLink,RequestOptions opt = null)
        {
           var task= Client.ReadDocumentCollectionAsync(collectionLink, opt);
            task.Wait();
            return task.Result.Resource;
        }
        public async Task<ResourceResponse<DocumentCollection>> ReadDocumentCollectionAsync(string dbLink, RequestOptions opt = null)
        {
            return await Client.ReadDocumentCollectionAsync(dbLink, opt);
        }

        public async Task<ResourceResponse<Document>> ReadDocumentAsync(string documentLink,RequestOptions opt=null)
        {
            return await Client.ReadDocumentAsync(documentLink, opt);
        }
        public Document ReadDocument(string documentLink, RequestOptions opt = null)
        {
            var t= Client.ReadDocumentAsync(documentLink, opt);
            t.Wait();
            return t.Result.Resource;
        }

        public async Task<ResourceResponse<Attachment>> ReadAttachmentAsync(string link, RequestOptions opt = null)
        {
            return await Client.ReadAttachmentAsync(link, opt);
        }
        public async Task<ResourceResponse<Conflict>> ReadConflictAsync(string link, RequestOptions opt = null)
        {
            return await Client.ReadConflictAsync(link, opt);
        }

        public void Dispose()
        {
            Client.Dispose();
            GC.Collect();
        }
    }
}
