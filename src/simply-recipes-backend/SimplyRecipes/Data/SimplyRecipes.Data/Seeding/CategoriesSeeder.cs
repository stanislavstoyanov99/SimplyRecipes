namespace SimplyRecipes.Data.Seeding
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Common;
    using SimplyRecipes.Data.Models;

    public class CategoriesSeeder : ISeeder
    {
        public async Task SeedAsync(
            SimplyRecipesDbContext dbContext,
            IServiceProvider serviceProvider,
            IOptions<ApplicationConfig> appConfig)
        {
            if (dbContext.Categories.Any())
            {
                return;
            }

            var categories = new List<Category>();
            var categoryNames = new List<string>()
            {
                "Main Dish", "Salads", "Dessert", "Soups", "Fruits", "Vegetables", "Starters"
            };

            for (int i = 0; i < categoryNames.Count; i++)
            {
                categories.Add(new Category
                {
                    Name = categoryNames[i],
                    Description = Utils.GenerateLoremIpsum(1, 40, 1, 3, 1)
                });
            }

            foreach (var category in categories)
            {
                await dbContext.Categories.AddAsync(category);
            }

            await dbContext.SaveChangesAsync();
        }
    }
}
