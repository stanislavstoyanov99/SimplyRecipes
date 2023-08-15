namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using SimplyRecipes.Models.ViewModels.Reviews;

    public class ReviewsController : ApiController
    {
        private readonly IReviewsService reviewsService;
        private readonly UserManager<SimplyRecipesUser> userManager;

        public ReviewsController(
            IReviewsService reviewsService,
            UserManager<SimplyRecipesUser> userManager)
        {
            this.reviewsService = reviewsService;
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize]
        [Route("send-review")]
        public async Task<ActionResult> SendReview([FromBody] CreateReviewInputModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(model);
            }

            var userId = this.userManager.GetUserId(this.User);

            try
            {
                var review = await this.reviewsService.CreateAsync(model, userId);

                return this.Ok(review);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("remove/{id}")]
        public async Task<ActionResult> Remove(int id)
        {
            var newRate = await this.reviewsService.DeleteReviewByIdAsync(id);

            return this.Ok(newRate);
        }
    }
}
