﻿namespace Immuno.Configuration
{
    using Microsoft.Extensions.Configuration;
    public interface IConfigurationSectionStartup: IConfigurationStartup
    {
        void Configure(IConfigurationSection section);
    }
}
