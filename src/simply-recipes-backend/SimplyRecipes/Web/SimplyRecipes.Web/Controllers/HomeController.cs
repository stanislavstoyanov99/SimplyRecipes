namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Models.ViewModels.Home;
    using SimplyRecipes.Models.ViewModels.Privacy;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Mvc;

    public class HomeController : ApiController
    {
        private const int TopRecipesCounter = 6;
        private const int RecentArticlesCounter = 2;

        private readonly IPrivacyService privacyService;
        private readonly IArticlesService articlesService;
        private readonly IRecipesService recipesService;

        public HomeController(
            IPrivacyService privacyService,
            IArticlesService articlesService,
            IRecipesService recipesService)
        {
            this.privacyService = privacyService;
            this.articlesService = articlesService;
            this.recipesService = recipesService;
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult> Get()
        {
            var topRecipes = await this
                .recipesService.GetTopRecipesAsync<RecipeListingViewModel>(TopRecipesCounter);

            var recentArticles = await this
                .articlesService.GetRecentArticlesAsync<ArticleListingViewModel>(RecentArticlesCounter);

            var gallery = await this
                .recipesService.GetAllRecipesAsync<GalleryViewModel>();

            var responseModel = new HomePageViewModel
            {
                TopRecipes = topRecipes,
                RecentArticles = recentArticles,
                Gallery = gallery,
            };

            return this.Ok(responseModel);
        }

        [HttpGet("Privacy")]
        public async Task<ActionResult> Privacy()
        {
            var responseModel = await this.privacyService.GetViewModelAsync<PrivacyDetailsViewModel>();

            return this.Ok(responseModel);
        }
    }
}
