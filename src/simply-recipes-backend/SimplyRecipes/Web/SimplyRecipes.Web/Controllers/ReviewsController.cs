namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.Reviews;
    using SimplyRecipes.Common;
    using SimplyRecipes.Web.Infrastructure.Services;

    public class ReviewsController : ApiController
    {
        private readonly IReviewsService reviewsService;
        private readonly ICurrentUserService currentUserService;

        public ReviewsController(
            IReviewsService reviewsService,
            ICurrentUserService currentUserService)
        {
            this.reviewsService = reviewsService;
            this.currentUserService = currentUserService;
        }

        [HttpPost("submit")]
        [ProducesResponseType(typeof(ReviewDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> Submit([FromBody] CreateReviewInputModel model)
        {
            try
            {
                var userId = this.currentUserService.GetId();
                var review = await this.reviewsService
                    .CreateAsync(model, userId);

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
