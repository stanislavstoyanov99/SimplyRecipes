namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;
    using System;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Models.ViewModels.ExternalAuth;
    using SimplyRecipes.Services.Data.Interfaces;

    public class ExternalAuthController : ApiController
    {
        private readonly IExternalAuthService externalAuthService;

        public ExternalAuthController(IExternalAuthService externalAuthService)
        {
            this.externalAuthService = externalAuthService;
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(typeof(ExternalAuthAuthenticateResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route(nameof(AuthenticateWithFb))]
        public async Task<ActionResult> AuthenticateWithFb(AuthenticateFbRequestModel model)
        {
            try
            {
                var response = await this.externalAuthService.AuthenticateWithFbAsync(model);

                return Ok(response);
            }
            catch (NullReferenceException nre)
            {
                return BadRequest(new ExternalAuthAuthenticateResponseModel { IsAuthSuccessful = false, Errors = nre.Message });
            }
            catch (ArgumentException aex)
            {
                return Unauthorized(new ExternalAuthAuthenticateResponseModel { IsAuthSuccessful = false, Errors = aex.Message });
            }
        }
    }
}
