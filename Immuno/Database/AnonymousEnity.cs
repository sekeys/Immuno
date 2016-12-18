using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Immuno.Database
{
    public class AnonymousEnity:IEntity
    {

        public IEnchyma Model { get; private set; } = new Enchyma();

        public bool IsAppended
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public bool IsModified
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public void SaveChanged()
        {
            throw new NotImplementedException();
        }

        public IEntity Find(Expression<Func<IEntity, bool>> wherelambda)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> Finds(Expression<Func<IEntity, bool>> wherelambda)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> Take(int i)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> Skip(int i)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> OrderBy(Expression<Func<IEntity, bool>> lambda)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> Last()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> Position(int index)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IEntity> FirstOrDefault()
        {
            throw new NotImplementedException();
        }

        public void ResetModifyStatus()
        {
            throw new NotImplementedException();
        }
    }
}
