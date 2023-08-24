namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Common;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.AdminDashboard;
    using SimplyRecipes.Services.Data.Interfaces;

    [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
    public class AdminDashboardController : ApiController
    {
        private readonly IDeletableEntityRepository<SimplyRecipesUser> usersRepository;
        private readonly IDeletableEntityRepository<Recipe> recipesRepository;
        private readonly IDeletableEntityRepository<Article> articlesRepository;
        private readonly IDeletableEntityRepository<Review> reviewsRepository;
        private readonly IDeletableEntityRepository<ArticleComment> articleCommentsRepository;
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly IAdminDashboardService adminDashboardService;

        public AdminDashboardController(
            IDeletableEntityRepository<SimplyRecipesUser> usersRepository,
            IDeletableEntityRepository<Recipe> recipesRepository,
            IDeletableEntityRepository<Article> articlesRepository,
            IDeletableEntityRepository<Review> reviewsRepository,
            IDeletableEntityRepository<ArticleComment> articleCommentsRepository,
            UserManager<SimplyRecipesUser> userManager,
            IAdminDashboardService adminDashboardService)
        {
            this.usersRepository = usersRepository;
            this.recipesRepository = recipesRepository;
            this.articlesRepository = articlesRepository;
            this.reviewsRepository = reviewsRepository;
            this.articleCommentsRepository = articleCommentsRepository;
            this.userManager = userManager;
            this.adminDashboardService = adminDashboardService;
        }

        [HttpGet("statistics")]
        public async Task<ActionResult> Statistics()
        {
            try
            {
                var recipesCount = await this.recipesRepository.All().CountAsync();
                var articlesCount = await this.articlesRepository.All().CountAsync();
                var reviewsCount = await this.reviewsRepository.All().CountAsync();
                var registeredUsersCount = await this.usersRepository.All().CountAsync();
                var administrators = await this.userManager.GetUsersInRoleAsync(GlobalConstants.AdministratorRoleName);
                var articleCommentsCount = await this.articleCommentsRepository.All().CountAsync();

                var registeredUsersPerMonth = this.adminDashboardService.GetRegisteredUsersPerMonth();
                var registeredAdminsPerMonth = await this.adminDashboardService.GetRegisteredAdminsPerMonthAsync();

                var topCategories = await this.adminDashboardService.GetTopCategoriesAsync();

                var topRecipes = await this.adminDashboardService.GetTopRecipesAsync();

                var topArticleComments = await this.adminDashboardService.GetTopArticleCommentsAsync();

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
            catch (ArgumentException aex)
            {
                return BadRequest(aex.Message);
            }
        }
    }
}
