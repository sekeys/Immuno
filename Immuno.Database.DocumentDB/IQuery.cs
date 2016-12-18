
namespace Immuno.Database.DocumentDB
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using Microsoft.Azure.Documents.Linq;
    using System.Linq.Expressions;

    public interface IQuery<T> where T : Document
    {
        T Query(string id);
        IEnumerable<T> Query(T value, FeedOptions opt = null);
        IEnumerable<T> Query(Expression<Func<T, bool>> action, FeedOptions opt = null);
        IEnumerable<T> Query( FeedOptions opt = null);
        IEnumerable<T> QueryWithSqlSpec(string sql, FeedOptions opt = null);

        IEnumerable<T2> Query<T2>(Expression<Func<T, bool>> action, Expression<Func<T, int, T2>> select, FeedOptions opt = null);
        IEnumerable<T> Query(Expression<Func<T, bool>> action, Expression<Func<T, int, T>> select, FeedOptions opt = null);

        Task<object> QueryWithJavaScript(string script);
        IOrderedQueryable<T> CreateQuery();
        IOrderedQueryable<T> CreateQuery(string collection);
    }
}
