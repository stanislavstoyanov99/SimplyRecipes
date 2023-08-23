namespace SimplyRecipes.Web.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Common;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.AdminDashboard;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Threading.Tasks;

    [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
    public class AdminDashboardController : ApiController
    {
        private readonly IDeletableEntityRepository<SimplyRecipesUser> usersRepository;
        private readonly IDeletableEntityRepository<Recipe> recipesRepository;
        private readonly IDeletableEntityRepository<Article> articlesRepository;
        private readonly IDeletableEntityRepository<Review> reviewsRepository;
        private readonly IDeletableEntityRepository<ArticleComment> articleCommentsRepository;
        private readonly UserManager<SimplyRecipesUser> userManager;

        private const int TopCountNumber = 5;

        public AdminDashboardController(
            IDeletableEntityRepository<SimplyRecipesUser> usersRepository,
            IDeletableEntityRepository<Recipe> recipesRepository,
            IDeletableEntityRepository<Article> articlesRepository,
            IDeletableEntityRepository<Review> reviewsRepository,
            IDeletableEntityRepository<ArticleComment> articleCommentsRepository,
            UserManager<SimplyRecipesUser> userManager)
        {
            this.usersRepository = usersRepository;
            this.recipesRepository = recipesRepository;
            this.articlesRepository = articlesRepository;
            this.reviewsRepository = reviewsRepository;
            this.articleCommentsRepository = articleCommentsRepository;
            this.userManager = userManager;
        }

        [HttpGet("statistics")]
        public async Task<ActionResult> Statistics()
        {
            var recipesCount = await this.recipesRepository.All().CountAsync();
            var articlesCount = await this.articlesRepository.All().CountAsync();
            var reviewsCount = await this.reviewsRepository.All().CountAsync();
            var registeredUsersCount = await this.usersRepository.All().CountAsync();
            var administrators = await this.userManager.GetUsersInRoleAsync(GlobalConstants.AdministratorRoleName);
            var articleCommentsCount = await this.articleCommentsRepository.All().CountAsync();
            var registeredUsersPerMonth = GetRegisteredUsersPerMonth();
            var registeredAdminsPerMonth = await GetRegisteredAdminsPerMonthAsync();

            var topCategories = await this.recipesRepository
                .All()
                .GroupBy(g => g.Category.Name)
                .Select(s => new TopCategoryViewModel { Name = s.Key, Count = s.Count() })
                .Take(TopCountNumber)
                .OrderByDescending(o => o.Count)
                .ToListAsync();

            var topRecipes = await this.recipesRepository
                .All()
                .Select(s => new TopRecipeViewModel { Name = s.Name, Rate = s.Rate })
                .Take(TopCountNumber)
                .OrderByDescending(o => o.Rate)
                .ToListAsync();

            var topArticleComments = await this.articlesRepository
                .All()
                .Select(x => new TopArticleViewModel { Title = x.Title, Count = x.ArticleComments.Count })
                .Take(TopCountNumber)
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            var statistics = new StatisticsViewModel
            {
                RecipesCount = recipesCount,
                ArticlesCount = articlesCount,
                ReviewsCount = reviewsCount,
                RegisteredUsersCount = registeredUsersCount,
                AdminsCount = administrators.Count(),
                ArticleCommentsCount = articleCommentsCount,
                TopCategories = topCategories,
                TopRecipes = topRecipes,
                TopArticleComments = topArticleComments,
                RegisteredUsersPerMonth = registeredUsersPerMonth,
                RegisteredAdminsPerMonth = registeredAdminsPerMonth
            };

            return Ok(statistics);
        }

        private Dictionary<string, int> GetRegisteredUsersPerMonth()
        {
            var registeredUsersPerMonth = new Dictionary<string, int>();
            var monthNames = DateTimeFormatInfo.InvariantInfo.MonthNames
                .Where(month => !string.IsNullOrEmpty(month))
                .ToList();
            for (var i = 0; i < monthNames.Count; ++i)
            {
                var countOfUsers = this.usersRepository
                    .All()
                    .Count(x => x.CreatedOn.Month == i + 1);
                registeredUsersPerMonth.Add(monthNames[i], countOfUsers);
            }

            return registeredUsersPerMonth;
        }

        private async Task<Dictionary<string, int>> GetRegisteredAdminsPerMonthAsync()
        {
            var registeredAdminsPerMonth = new Dictionary<string, int>();
            var monthNames = DateTimeFormatInfo.InvariantInfo.MonthNames
                .Where(month => !string.IsNullOrEmpty(month))
                .ToList();
            var admins = await this.userManager.GetUsersInRoleAsync(GlobalConstants.AdministratorRoleName);

            for (var i = 0; i < monthNames.Count; ++i)
            {
                var countOfAdmins = admins.Count(x => x.CreatedOn.Month == i + 1);
                registeredAdminsPerMonth.Add(monthNames[i], countOfAdmins);
            }

            return registeredAdminsPerMonth;
        }
    }
}
