namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Models.ViewModels.Privacy;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Services.Data.Interfaces;

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

        [HttpGet("top-recipes")]
        [ProducesResponseType(
            typeof(IEnumerable<RecipeListingViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> GetTopRecipes()
        {
            var topRecipes = await this.recipesService
                .GetTopRecipesAsync<RecipeListingViewModel>(TopRecipesCounter);

            return this.Ok(topRecipes);
        }

        [HttpGet("recent-articles")]
        [ProducesResponseType(
            typeof(IEnumerable<ArticleListingViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> GetRecentArticles()
        {
            var recentArticles = await this.articlesService
                .GetRecentArticlesAsync<ArticleListingViewModel>(RecentArticlesCounter);

            return this.Ok(recentArticles);
        }

        [HttpGet("gallery")]
        [ProducesResponseType(
            typeof(IEnumerable<GalleryViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> GetGallery()
        {
            var gallery = await this.recipesService
                .GetAllRecipesAsync<GalleryViewModel>();

            return this.Ok(gallery);
        }

        [HttpGet("privacy")]
        [ProducesResponseType(typeof(PrivacyDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Privacy()
        {
            try
            {
                var responseModel = await this.privacyService
                    .GetViewModelAsync<PrivacyDetailsViewModel>();

                return this.Ok(responseModel);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
