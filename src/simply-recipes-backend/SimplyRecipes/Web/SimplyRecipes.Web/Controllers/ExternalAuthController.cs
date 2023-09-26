namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;
    using System;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Models.ViewModels.ExternalAuth;
    using SimplyRecipes.Services.Data.Interfaces;
    using Microsoft.Extensions.Options;

    public class ExternalAuthController : ApiController
    {
        private readonly IExternalAuthService externalAuthService;
        private readonly IOptions<ApplicationConfig> appConfig;

        public ExternalAuthController(IExternalAuthService externalAuthService, IOptions<ApplicationConfig> appConfig)
        {
            this.externalAuthService = externalAuthService;
            this.appConfig = appConfig;
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
                var response = await this.externalAuthService.AuthenticateWithFbAsync(model, GetIpAddress());
                this.SetTokenCookie(response.RefreshToken);

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

        private string GetIpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                return Request.Headers["X-Forwarded-For"];
            }
            else
            {
                return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
            }
        }

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(this.appConfig.Value.RefreshTokenExpiration),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }
}
