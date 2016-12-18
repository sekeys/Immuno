using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Database
{
    using System.Linq;
    using System.Linq.Expressions;
    public interface IEntity: IModelMonitoring
    {
        void SaveChanged();
        IEntity Find(Expression<Func<IEntity,bool>> wherelambda);
        IEnumerable<IEntity> Finds(Expression<Func<IEntity, bool>> wherelambda);
        IEnumerable<IEntity> Take(int i);
        IEnumerable<IEntity> Skip(int i);
        IEnumerable<IEntity> OrderBy(Expression<Func<IEntity, bool>> lambda);
        IEnumerable<IEntity> Last();
        IEnumerable<IEntity> Position(int index);
        IEnumerable<IEntity> FirstOrDefault();

    }

}
