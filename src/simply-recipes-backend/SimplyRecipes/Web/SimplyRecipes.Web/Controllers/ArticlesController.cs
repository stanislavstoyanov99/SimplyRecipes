namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.AspNetCore.Http;

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
        private const int AdminPageSize = 10;
        private const int RecentArticlesCount = 6;
        private const int ArticlesByCategoryCount = 5;
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

        [HttpGet("main")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<ArticleListingViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> Main([FromQuery] int? pageNumber)
        {
            var allArticles = this.articlesService.GetAllArticlesAsQueryeable<ArticleListingViewModel>();

            var articlesPaginated = await PaginatedList<ArticleListingViewModel>
                .CreateAsync(allArticles, pageNumber ?? 1, PageSize);

            var responseModel = new PaginatedViewModel<ArticleListingViewModel>
            {
                Items = articlesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = PageSize,
                Count = await allArticles.CountAsync()
            };

            return Ok(responseModel);
        }

        [HttpGet("get-all")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<ArticleDetailsViewModel>),
            StatusCodes.Status200OK)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> All([FromQuery] int? pageNumber)
        {
            var articles = this.articlesService.GetAllArticlesAsQueryeable<ArticleDetailsViewModel>();

            var articlesPaginated = await PaginatedList<ArticleDetailsViewModel>
                .CreateAsync(articles, pageNumber ?? 1, AdminPageSize);

            var responseModel = new PaginatedViewModel<ArticleDetailsViewModel>
            {
                Items = articlesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = AdminPageSize,
                Count = await articles.CountAsync()
            };

            return this.Ok(responseModel);
        }

        [HttpGet("details/{id}")]
        [ProducesResponseType(typeof(ArticleListingViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
        [ProducesResponseType(typeof(ArticleSidebarViewModel), StatusCodes.Status200OK)]
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

        [HttpGet("search")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<ArticleListingViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> Search([FromQuery] string query, [FromQuery] int? pageNumber)
        {
            if (string.IsNullOrEmpty(query))
            {
                return this.NotFound();
            }

            // Full-text search via introducing new column SearchText (will full-text index) directly in SQL Server
            var articles = this.articlesService
                .GetAllArticlesAsQueryeableBySearchQuery(query);

            // Full-text search via ElasticSearch (in production needs to be paied)
            //var fullTextSearch = await this.fullTextSearch
            //    .Query<ArticleFullTextSearchModel>(
            //        a => a.Description,
            //        searchTitle);

            //var ids = fullTextSearch.Select(a => a.ArticleId);

            //articles = articles.Where(a => ids.Contains(a.Id));

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

        [HttpGet("by-category")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<ArticleListingViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> ByCategory([FromQuery] string categoryName, [FromQuery] int? pageNumber)
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
        [ProducesResponseType(
            typeof(IEnumerable<CategoryDetailsViewModel>),
            StatusCodes.Status200OK)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit()
        {
            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryDetailsViewModel>();

            return this.Ok(categories);
        }

        [HttpPost("submit")]
        [ProducesResponseType(typeof(ArticleDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit([FromForm] ArticleCreateInputModel articleCreateInputModel)
        {
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
        [ProducesResponseType(typeof(ArticleDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Edit([FromForm] ArticleEditViewModel articleEditViewModel)
        {
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
