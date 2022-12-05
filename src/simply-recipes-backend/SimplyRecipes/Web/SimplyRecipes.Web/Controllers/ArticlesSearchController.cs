namespace SimplyRecipes.Web.Controllers
{
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Mvc;

    public class ArticlesSearchController : ApiController
    {
        private const int ArticlesInSearchPage = 4;

        private readonly IArticlesService articlesService;

        public ArticlesSearchController(IArticlesService articlesService)
        {
            this.articlesService = articlesService;
        }

        [HttpGet]
        [Route("{pageNumber?}/{searchTitle}")]
        public async Task<ActionResult<PaginatedList<ArticleListingViewModel>>> Get(
            [FromRoute] int? pageNumber,
            [FromRoute] string searchTitle)
        {
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
    }
}
