namespace SimplyRecipes.Services.Data
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Common;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.AdminDashboard;
    using SimplyRecipes.Services.Data.Interfaces;

    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IDeletableEntityRepository<Recipe> recipesRepository;
        private readonly IDeletableEntityRepository<Article> articlesRepository;
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly IDeletableEntityRepository<SimplyRecipesUser> usersRepository;

        private const int TopCountNumber = 5;

        public AdminDashboardService(
            IDeletableEntityRepository<Recipe> recipesRepository,
            IDeletableEntityRepository<Article> articlesRepository,
            UserManager<SimplyRecipesUser> userManager,
            IDeletableEntityRepository<SimplyRecipesUser> usersRepository)
        {
            this.recipesRepository = recipesRepository;
            this.articlesRepository = articlesRepository;
            this.userManager = userManager;
            this.usersRepository = usersRepository;
        }

        public async Task<Dictionary<string, int>> GetRegisteredAdminsPerMonthAsync()
        {
            var registeredAdminsPerMonth = new Dictionary<string, int>();
            var monthNames = this.GetMonthNames();
            var admins = await this.userManager.GetUsersInRoleAsync(GlobalConstants.AdministratorRoleName);

            for (var i = 0; i < monthNames.Count; ++i)
            {
                var countOfAdmins = admins.Count(x => x.CreatedOn.Month == i + 1);
                registeredAdminsPerMonth.Add(monthNames[i], countOfAdmins);
            }

            return registeredAdminsPerMonth;
        }

        public Dictionary<string, int> GetRegisteredUsersPerMonth()
        {
            var registeredUsersPerMonth = new Dictionary<string, int>();
            var monthNames = this.GetMonthNames();

            for (var i = 0; i < monthNames.Count; ++i)
            {
                var countOfUsers = this.usersRepository
                    .All()
                    .Count(x => x.CreatedOn.Month == i + 1);
                registeredUsersPerMonth.Add(monthNames[i], countOfUsers);
            }

            return registeredUsersPerMonth;
        }

        public async Task<List<TopArticleViewModel>> GetTopArticleCommentsAsync()
        {
            var topArticleComments = await this.articlesRepository
                .All()
                .Select(x => new TopArticleViewModel { Title = x.Title, Count = x.ArticleComments.Count })
                .Take(TopCountNumber)
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            return topArticleComments;
        }

        public async Task<List<TopCategoryViewModel>> GetTopCategoriesAsync()
        {
            var topCategories = await this.recipesRepository
                .All()
                .GroupBy(g => g.Category.Name)
                .Select(s => new TopCategoryViewModel { Name = s.Key, Count = s.Count() })
                .Take(TopCountNumber)
                .OrderByDescending(o => o.Count)
                .ToListAsync();

            return topCategories;
        }

        public async Task<List<TopRecipeViewModel>> GetTopRecipesAsync()
        {
            var topRecipes = await this.recipesRepository
                .All()
                .Select(s => new TopRecipeViewModel { Name = s.Name, Rate = s.Rate })
                .Take(TopCountNumber)
                .OrderByDescending(o => o.Rate)
                .ToListAsync();

            return topRecipes;
        }

        private List<string> GetMonthNames()
        {
            var monthNames = DateTimeFormatInfo.InvariantInfo.MonthNames
               .Where(month => !string.IsNullOrEmpty(month))
               .ToList();

            return monthNames;
        }
    }
}
