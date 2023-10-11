namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.Reviews;
    using SimplyRecipes.Common;

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

        [HttpPost("submit")]
        [ProducesResponseType(typeof(ReviewDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> Submit([FromBody] CreateReviewInputModel model)
        {
            try
            {
                var userId = this.userManager.GetUserId(this.User);
                var review = await this.reviewsService.CreateAsync(model, userId);

                return this.Ok(review);
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
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Remove(int id)
        {
            try
            {
                var newRate = await this.reviewsService.DeleteReviewByIdAsync(id);

                return this.Ok(newRate);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
