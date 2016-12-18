using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Immuno.Database
{

    public interface IDatabase<T>
    {
        List<T> Finds(Expression<Func<T, bool>> lambda);
        int Remove(Expression<Func<T, bool>> lambda);
        IQueryable<T> Source();
        T Find(Expression<Func<T, bool>> lambda);
        T Update(Expression<Func<T, bool>> lambda);
        T FindOrInsert(Expression<Func<T,bool>> lambda);
        string ConnectionString { get;  }
        void ReConnectionString(string connectionString);
    }
    public interface IDatabase
    {
        
    }
}
