namespace SimplyRecipes.Web.Controllers
{
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.InputModels.Administration.Articles;
    using SimplyRecipes.Common;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;

    public class ArticlesController : ApiController
    {
        private const int PageSize = 9;
        private const int RecentArticlesCount = 6;
        private const int ArticlesByCategoryCount = 6;
        private const int ArticlesInSearchPage = 4;

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
            var allArticles = await Task.Run(() =>
                this.articlesService.GetAllArticlesAsQueryeable<ArticleListingViewModel>());

            var responseModel = await PaginatedList<ArticleListingViewModel>.CreateAsync(allArticles, pageNumber ?? 1, PageSize);

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
            var article = await this.articlesService
                .GetViewModelByIdAsync<ArticleListingViewModel>(id);

            return this.Ok(article);
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
        [Route("search")]
        public async Task<ActionResult> Search(string searchTitle)
        {
            if (string.IsNullOrEmpty(searchTitle))
            {
                return this.NotFound();
            }

            var articles = await Task.Run(() => this.articlesService
                .GetAllArticlesAsQueryeable<ArticleListingViewModel>()
                .Where(a => a.Title.ToLower().Contains(searchTitle.ToLower())));

            var responseModel = await PaginatedList<ArticleListingViewModel>
                .CreateAsync(articles, 1, ArticlesInSearchPage);

            return this.Ok(responseModel);
        }

        [HttpGet]
        [Route("by-category")]
        public async Task<ActionResult> ByCategory(string categoryName)
        {
            var articlesByCategoryName = await Task.Run(() => this.articlesService
                .GetAllArticlesByCategoryNameAsQueryeable<ArticleListingViewModel>(categoryName));

            if (articlesByCategoryName.Count() == 0)
            {
                return this.NotFound();
            }

            var responseModel = await PaginatedList<ArticleListingViewModel>
                    .CreateAsync(articlesByCategoryName, 1, ArticlesByCategoryCount);

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
        public async Task<IActionResult> Submit([FromForm] ArticleCreateInputModel articleCreateInputModel)
        {
            var user = await this.userManager.GetUserAsync(this.User);

            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(articleCreateInputModel);
            }

            var article = await this.articlesService.CreateAsync(articleCreateInputModel, user.Id);

            return this.Ok(article);
        }

        [HttpPut("edit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<IActionResult> Edit([FromForm] ArticleEditViewModel articleEditViewModel)
        {
            var user = await this.userManager.GetUserAsync(this.User);

            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(articleEditViewModel);
            }

            var article = await this.articlesService.EditAsync(articleEditViewModel, user.Id);

            return this.Ok(article);
        }

        [HttpDelete("remove/{id}")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<IActionResult> Remove(int id)
        {
            await this.articlesService.DeleteByIdAsync(id);

            return this.Ok();
        }
    }
}
