namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.InputModels.Administration.Articles;
    using SimplyRecipes.Common;
    using SimplyRecipes.Models.Common;

    public class ArticlesController : ApiController
    {
        private const int PageSize = 9;
        private const int RecentArticlesCount = 6;
        private const int ArticlesByCategoryCount = 6;
        private const int ArticlesInSearchPage = 5;

        private readonly IArticlesService articlesService;
        private readonly ICategoriesService categoriesService;
        private readonly UserManager<SimplyRecipesUser> userManager;

        public ArticlesController(
            IArticlesService articlesService,
            ICategoriesService categoriesService,
            UserManager<SimplyRecipesUser> userManager)
        {
            this.articlesService = articlesService;
            this.categoriesService = categoriesService;
            this.userManager = userManager;
        }

        [HttpGet("{pageNumber?}")]
        public async Task<ActionResult> Get([FromRoute] int? pageNumber)
        {
            var allArticles = this.articlesService.GetAllArticlesAsQueryeable<ArticleListingViewModel>();

            var articlesPaginated = await PaginatedList<ArticleListingViewModel>.CreateAsync(allArticles, pageNumber ?? 1, PageSize);

            var responseModel = new PaginatedViewModel<ArticleListingViewModel>
            {
                Items = articlesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = PageSize,
                Count = await allArticles.CountAsync()
            };

            return Ok(responseModel);
        }

        [HttpGet("all")]
        public async Task<ActionResult> All()
        {
            var articles = await this.articlesService.GetAllArticlesAsync<ArticleDetailsViewModel>();

            return this.Ok(articles);
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult> Details([FromRoute] int id)
        {
            try
            {
                var article = await this.articlesService
                    .GetViewModelByIdAsync<ArticleListingViewModel>(id);

                return this.Ok(article);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpGet("sidebar")]
        public async Task<ActionResult> Sidebar()
        {
            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryListingViewModel>();

            var recentArticles = await this.articlesService
                .GetRecentArticlesAsync<RecentArticleListingViewModel>(RecentArticlesCount);

            var responseModel = new ArticleSidebarViewModel
            {
                Categories = categories,
                RecentArticles = recentArticles,
            };

            return this.Ok(responseModel);
        }

        [HttpGet]
        [Route("search/{searchTitle}/{pageNumber?}")]
        public async Task<ActionResult> Search(string searchTitle, int? pageNumber)
        {
            if (string.IsNullOrEmpty(searchTitle))
            {
                return this.NotFound();
            }

            var articles = this.articlesService
                .GetAllArticlesAsQueryeable<ArticleListingViewModel>()
                .Where(a => a.Title.ToLower().Contains(searchTitle.ToLower()));

            var articlesPaginated = await PaginatedList<ArticleListingViewModel>
                .CreateAsync(articles, pageNumber ?? 1, ArticlesInSearchPage);

            var responseModel = new PaginatedViewModel<ArticleListingViewModel>
            {
                Items = articlesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = ArticlesInSearchPage,
                Count = await articles.CountAsync()
            };

            return this.Ok(responseModel);
        }

        [HttpGet]
        [Route("by-category/{categoryName}/{pageNumber?}")]
        public async Task<ActionResult> ByCategory(string categoryName, int? pageNumber)
        {
            var articlesByCategoryName = this.articlesService
                .GetAllArticlesByCategoryNameAsQueryeable<ArticleListingViewModel>(categoryName);

            if (articlesByCategoryName.Count() == 0)
            {
                return this.NotFound();
            }

            var articlesPaginated = await PaginatedList<ArticleListingViewModel>
                    .CreateAsync(articlesByCategoryName, pageNumber ?? 1, ArticlesByCategoryCount);

            var responseModel = new PaginatedViewModel<ArticleListingViewModel>
            {
                Items = articlesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = ArticlesByCategoryCount,
                Count = await articlesByCategoryName.CountAsync()
            };

            return this.Ok(responseModel);
        }

        [HttpGet("submit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit()
        {
            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryDetailsViewModel>();

            return this.Ok(categories);
        }

        [HttpPost("submit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit([FromForm] ArticleCreateInputModel articleCreateInputModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(articleCreateInputModel);
            }

            try
            {
                var user = await this.userManager.GetUserAsync(this.User);
                var article = await this.articlesService.CreateAsync(articleCreateInputModel, user.Id);

                return this.Ok(article);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpPut("edit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Edit([FromForm] ArticleEditViewModel articleEditViewModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(articleEditViewModel);
            }

            try
            {
                var user = await this.userManager.GetUserAsync(this.User);
                var article = await this.articlesService.EditAsync(articleEditViewModel, user.Id);

                return this.Ok(article);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpDelete("remove/{id}")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Remove(int id)
        {
            try
            {
                await this.articlesService.DeleteByIdAsync(id);

                return this.Ok();
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
