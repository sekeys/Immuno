using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Configuration
{
    public interface IConfigurationStartupBase 
    {
        string ConfigurePath { get; }
        void Configure();

    }


}
