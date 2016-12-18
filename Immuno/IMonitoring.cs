using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno
{
    public interface IModelMonitoring
    {
        bool IsAppended { get; }
        bool IsModified { get; }
        void ResetModifyStatus();
    }
}
