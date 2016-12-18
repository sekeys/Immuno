﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Features
{
    public interface IExpressFeatureCollection<T>:IFeatureCollection
    {
        bool Express(T t);
    }
}
