namespace SimplyRecipes.Data.Seeding
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;

    public interface ISeeder
    {
        Task SeedAsync(
            SimplyRecipesDbContext dbContext,
            IServiceProvider serviceProvider,
            IOptions<ApplicationConfig> appConfig);
    }
}
