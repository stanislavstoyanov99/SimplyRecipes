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

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddDatabase(this.Configuration)
                .AddCustomRouting()
                .AddIdentity()
                .AddAuthentication(services.GetApplicationConfig(this.Configuration))
                .AddCors(options =>
                {
                    options.AddPolicy("AllowSpecificOrigin", builder =>
                    builder
                        .AllowCredentials()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .SetIsOriginAllowed((host) => true));
                })
                .AddApplicationServices(this.Configuration)
                .AddSwagger()
                .AddControllers()
                .AddNewtonsoftJson(options =>
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            AutoMapperConfig.RegisterMappings(typeof(ErrorViewModel).GetTypeInfo().Assembly);

            if (env.IsDevelopment())
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
