namespace SimplyRecipes.Web.Controllers
{
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Mvc;

    public class ArticlesController : ApiController
    {
        private const int PageSize = 9;
        private const int RecentArticlesCount = 6;
        private const int ArticlesByCategoryCount = 6;
        private const int ArticlesInSearchPage = 4;

        private readonly IArticlesService articlesService;
        private readonly ICategoriesService categoriesService;

        public ArticlesController(IArticlesService articlesService, ICategoriesService categoriesService)
        {
            this.articlesService = articlesService;
            this.categoriesService = categoriesService;
        }

        [HttpGet("{pageNumber?}")]
        public async Task<ActionResult> Get([FromRoute] int? pageNumber)
        {
            var allArticles = await Task.Run(() =>
                this.articlesService.GetAllArticlesAsQueryeable<ArticleListingViewModel>());

            var responseModel = await PaginatedList<ArticleListingViewModel>.CreateAsync(allArticles, pageNumber ?? 1, PageSize);

            return Ok(responseModel);
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
        [Route("search/{pageNumber?}/{searchTitle}")]
        public async Task<ActionResult> Search([FromRoute] int? pageNumber, [FromRoute] string searchTitle)
        {
            if (string.IsNullOrEmpty(searchTitle))
            {
                return this.NotFound();
            }

            var articles = await Task.Run(() => this.articlesService
                .GetAllArticlesAsQueryeable<ArticleListingViewModel>()
                .Where(a => a.Title.ToLower().Contains(searchTitle.ToLower())));

            if (articles.Count() == 0)
            {
                return this.NotFound();
            }

            var responseModel = await PaginatedList<ArticleListingViewModel>
                .CreateAsync(articles, pageNumber ?? 1, ArticlesInSearchPage);

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
    }
}
