namespace SimplyRecipes.Data.Seeding
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common;
    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data.Models;

    public class ArticlesSeeder : ISeeder
    {
        private readonly Random random;

        public ArticlesSeeder(Random random)
        {
            this.random = random;
        }

        public async Task SeedAsync(
            SimplyRecipesDbContext dbContext,
            IServiceProvider serviceProvider,
            IOptions<ApplicationConfig> appConfig)
        {
            if (dbContext.Articles.Any())
            {
                return;
            }

            var userManager = serviceProvider
                .GetRequiredService<UserManager<SimplyRecipesUser>>();

            var admin = await userManager.FindByNameAsync(appConfig.Value.AdministratorUserName);
            var categoriesCount = await dbContext.Categories.CountAsync();

            var articles = new List<Article>();

            for (int i = 1; i <= 100; i++)
            {
                articles.Add(new Article
                {
                    Title = $"Article {i}",
                    Description = Utils.GenerateLoremIpsum(1, 40, 1, 5, 2),
                    ImagePath = "https://res.cloudinary.com/simply-recipes/image/upload/v1692217540/Test%20Article%201_Article.jpg",
                    CategoryId = this.random.Next(1, categoriesCount),
                    UserId = admin.Id
                });
            }

            foreach (var article in articles)
            {
                article.SearchText = Utils.GetSearchText(article.Description, article.Title);
                await dbContext.Articles.AddAsync(article);
            }

            await dbContext.SaveChangesAsync();
        }
    }
}
