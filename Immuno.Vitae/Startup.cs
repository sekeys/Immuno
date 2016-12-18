using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.Extensions.PlatformAbstractions;
using Immuno;
using Immuno.Web;

namespace Immuno.Vitae
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
            Immuno.Log.Logger.DefaultLogPath = System.IO.Path.Combine(env.ContentRootPath, "log");

            Immuno.Configuration.ConfigurationStartup.RootConfigurePath =
              System.IO.Path.Combine(env.ContentRootPath, "setting.json");

            ImmunoServer.Server.Appsetting["hostdir"] = env.ContentRootPath;
            ImmunoServer.Server.Appsetting["rootDir"] = System.IO.Path.Combine(env.ContentRootPath, "Dirs");
            Immuno.Trigger.Trigger.Register(new Immuno.Trigger.Trigger());
            ImmunoServer.Server.Prepare();
            ImmunoServer.Server.Appsetting["contentrootpath"] = env.ContentRootPath;
            Immuno.Database.Unsophisticated.Unsophisticated.ConnectionString = ImmunoServer.Server.Appsetting["connectionstring"]; //;
            Immuno.Database.DocumentDB.DocumentContext.Endpoint = new Uri(ImmunoServer.Server.Appsetting["documentdb.endpoint"]);
            Immuno.Database.DocumentDB.DocumentContext.AuthKeyOrResourceToken = ImmunoServer.Server.Appsetting["documentdb.authkeyorresourcetoken"];
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            //if (env.IsDevelopment())
            //{
            app.UseDeveloperExceptionPage();
            //}

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, @"wwwroot")),
                RequestPath = new PathString("/wwwroot")
            });

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationScheme = Immuno.Web.Authentication.FormTicksAuSFeature.Schema,
                LoginPath = new PathString("/login"),
                AccessDeniedPath = new PathString("/Forbidden"),
                CookieName = ".u",
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
            });

            app.UseMiddleware<ImmunoMiddleware>();
        }
    }
}
