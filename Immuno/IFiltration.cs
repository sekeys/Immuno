using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Filration
{
    public interface IFiltration
    {
        IEnchyma In(IEnchyma enchyma);
        IEnchyma Out(IEnchyma residue);
    }
}
