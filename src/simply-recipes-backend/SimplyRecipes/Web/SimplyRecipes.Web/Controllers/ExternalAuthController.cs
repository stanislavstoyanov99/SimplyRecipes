namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;
    using System;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Common;
    using SimplyRecipes.Models.ViewModels.ExternalAuth;
    using SimplyRecipes.Services.Data.Interfaces;

    public class ExternalAuthController : ApiController
    {
        private readonly IExternalAuthService externalAuthService;
        private readonly IOptions<ApplicationConfig> appConfig;

        public ExternalAuthController(
            IExternalAuthService externalAuthService,
            IOptions<ApplicationConfig> appConfig)
        {
            this.externalAuthService = externalAuthService;
            this.appConfig = appConfig;
        }

        [AllowAnonymous]
        [HttpPost("authenticate-with-fb")]
        [ProducesResponseType(typeof(ExternalAuthAuthenticateResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ExternalAuthAuthenticateResponseModel), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ExternalAuthAuthenticateResponseModel), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> AuthenticateWithFb(AuthenticateFbRequestModel model)
        {
            try
            {
                var ipAddress = Utils.GetIpAddress(Request.Headers, HttpContext.Connection.RemoteIpAddress);
                var response = await this.externalAuthService.AuthenticateWithFbAsync(model, ipAddress);

                var cookieOptions = Utils.CreateTokenCookie(this.appConfig.Value.RefreshTokenExpiration);
                Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

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
