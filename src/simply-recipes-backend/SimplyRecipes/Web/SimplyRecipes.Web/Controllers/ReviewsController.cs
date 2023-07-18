namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;

    public class ReviewsController : ApiController
    {
        private readonly IReviewsService reviewsService;
        private readonly IRecipesService recipesService;
        private readonly UserManager<SimplyRecipesUser> userManager;

        public ReviewsController(
            IReviewsService reviewsService,
            UserManager<SimplyRecipesUser> userManager,
            IRecipesService recipesService)
        {
            this.reviewsService = reviewsService;
            this.recipesService = recipesService;
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize]
        [Route("post")]
        public async Task<ActionResult> Post([FromBody] RecipeDetailsPageViewModel input)
        {
            if (!this.ModelState.IsValid)
            {
                var recipe = await this.recipesService
                    .GetViewModelByIdAsync<RecipeDetailsViewModel>(input.Recipe.Id);

                var model = new RecipeDetailsPageViewModel
                {
                    Recipe = recipe,
                    CreateReviewInputModel = input.CreateReviewInputModel,
                };

                return this.Ok(model);
                // return this.View("/Views/Recipes/Details.cshtml", model);
            }

            var userId = this.userManager.GetUserId(this.User);
            input.CreateReviewInputModel.UserId = userId;

            try
            {
                await this.reviewsService.CreateAsync(input.CreateReviewInputModel);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }

            return this.Ok();
            // return this.RedirectToAction("Details", "Recipes", new { id = input.CreateReviewInputModel.RecipeId });
        }

        [HttpPost]
        [Route("remove")]
        public async Task<ActionResult> Remove([FromBody] int reviewId, int recipeId)
        {
            await this.reviewsService.DeleteByIdAsync(reviewId);

            return this.Ok();
            // return this.RedirectToAction("Details", "Recipes", new { id = recipeId });
        }
    }
}
