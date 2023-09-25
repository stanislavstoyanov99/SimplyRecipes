namespace SimplyRecipes.Web
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using System.Reflection;
    using Newtonsoft.Json;

    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Web.Infrastructure.Extensions;
    using Microsoft.AspNetCore.Http;

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            ConfigureServices(builder.Services, builder.Configuration);
            var app = builder.Build();
            Configure(app);
            app.Run();
        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddDatabase(configuration)
                .AddCustomRouting()
                .AddIdentity()
                .ConfigureApplicationCookie(options =>
                {
                    options.Cookie.SameSite = SameSiteMode.None;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                })
                .AddAuthentication(services.GetApplicationConfig(configuration))
                .AddCors(options =>
                {
                    options.AddPolicy("AllowSpecificOrigin", builder =>
                    builder
                        .AllowCredentials()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .SetIsOriginAllowed((host) => true));
                })
                .AddApplicationServices(configuration)
                .AddSwagger()
                .AddControllers()
                .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
        }

        private static void Configure(WebApplication app)
        {
            AutoMapperConfig.RegisterMappings(typeof(ErrorViewModel).GetTypeInfo().Assembly);

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app
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
