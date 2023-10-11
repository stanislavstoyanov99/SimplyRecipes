namespace SimplyRecipes.Web.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data;
    using SimplyRecipes.Data.Seeding;

    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseSwaggerUI(this IApplicationBuilder appBuilder)
        {
            return appBuilder
                .UseSwagger()
                .UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "SimplyRecipes API V1");
                    options.RoutePrefix = string.Empty;
                });
        }

        public static void ApplyMigrationsAndSeedDatabase(this IApplicationBuilder appBuilder)
        {
            using var serviceScope = appBuilder.ApplicationServices.CreateScope();

            var dbContext = serviceScope
                .ServiceProvider
                .GetService<SimplyRecipesDbContext>();

            dbContext.Database.Migrate();

            var appConfig = serviceScope
                .ServiceProvider
                .GetService<IOptions<ApplicationConfig>>();

            new SimplyRecipesDbContextSeeder()
                .SeedAsync(dbContext, serviceScope.ServiceProvider, appConfig)
                .GetAwaiter()
                .GetResult();
        }
    }
}
