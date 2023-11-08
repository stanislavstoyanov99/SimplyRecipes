namespace SimplyRecipes.Web
{
    using System.Reflection;

    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;

    using Newtonsoft.Json;

    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Web.Infrastructure.Extensions;

    public class Program
    {
        public static void Main(string[] args)
        {
            // Uncomment when Serilog logging is needed
            //var logConnection = Environment.GetEnvironmentVariable("LogConnection");

            //Log.Logger = new LoggerConfiguration()
            //    .Enrich.FromLogContext()
            //    .WriteTo.Http(logConnection, null)
            //    .WriteTo.Console()
            //    .CreateLogger();

            var builder = WebApplication.CreateBuilder(args);
            //builder.Host.UseSerilog();

            ConfigureServices(builder.Services, builder.Configuration);
            var app = builder.Build();
            Configure(app);
            app.Run();
        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddApplicationConfig(configuration)
                .AddDatabase(configuration)
                .AddCustomRouting()
                .AddIdentity()
                .ConfigureCookie()
                .AddAuthentication(configuration)
                .AddCors(configuration)
                .AddApplicationServices(configuration)
                // Uncomment when needed
                //.AddFullTextSearch<ArticleFullTextSearchModel>(configuration)
                .AddSwagger()
                .AddControllers()
                .AddNewtonsoftJson(options =>
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
        }

        private static void Configure(WebApplication app)
        {
            AutoMapperConfig.RegisterMappings(typeof(ErrorViewModel).GetTypeInfo().Assembly);

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app
                // Uncomment when needed
               //.UseSerilogRequestLogging()
               .UseSwaggerUI()
               .UseRouting()
               .UseCors("AllowSpecificOrigin")
               .UseAuthentication()
               .UseAuthorization()
               .UseEndpoints(endpoints =>
               {
                   endpoints.MapControllers();
               })
               .ApplyMigrationsAndSeedDatabase();
        }
    }
}
