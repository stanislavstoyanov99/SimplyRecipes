namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Models.ViewModels.Identity;
    using SimplyRecipes.Services.Data.Interfaces;

    public class IdentityController : ApiController
    {
        private readonly IIdentityService identityService;

        public IdentityController(IIdentityService identityService)
        {
            this.identityService = identityService;
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(typeof(RegisterResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RegisterResponseModel), StatusCodes.Status400BadRequest)]
        [Route(nameof(Register))]
        public async Task<ActionResult> Register(RegisterRequestModel model)
        {
            try
            {
                var result = await this.identityService.RegisterAsync(model);
                var response = new RegisterResponseModel
                {
                    Succeeded = result.Succeeded
                };

                return Ok(response);
            }
            catch (ArgumentException aex)
            {
                return BadRequest(new RegisterResponseModel { Succeeded = false, Errors = aex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status401Unauthorized)]
        [Route(nameof(Login))]
        public async Task<ActionResult> Login(LoginRequestModel model)
        {
            try
            {
                var response = await this.identityService.LoginAsync(model, GetIpAddress());
                this.SetTokenCookie(response.RefreshToken);

                return Ok(response);
            }
            catch (NullReferenceException nre)
            {
                return BadRequest(new LoginResponseModel { IsAuthSuccessful = false, Errors = nre.Message });
            }
            catch (ArgumentException ae)
            {
                return Unauthorized(new LoginResponseModel { IsAuthSuccessful = false, Errors = ae.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status400BadRequest)]
        [Route("refresh-token")]
        public async Task<ActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];

                var response = await this.identityService.RefreshTokenAsync(refreshToken, GetIpAddress());
                SetTokenCookie(response.RefreshToken);

                return Ok(response);
            }
            catch (ArgumentException ae)
            {
                return BadRequest(new LoginResponseModel { IsAuthSuccessful = false, Errors = ae.Message });
            }
            catch (NullReferenceException nre)
            {
                return BadRequest(new LoginResponseModel { IsAuthSuccessful = false, Errors = nre.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(typeof(RevokeTokenResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RevokeTokenResponseModel), StatusCodes.Status400BadRequest)]
        [Route("revoke-token")]
        public async Task<ActionResult> RevokeToken(RevokeTokenRequestModel model)
        {
            try
            {
                var token = model.Token ?? Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new RevokeTokenResponseModel { IsRevoked = false, Errors = "Token is required" });
                }

                var response = await this.identityService.RevokeToken(token, GetIpAddress());

                return Ok(response);
            }
            catch (ArgumentException ae)
            {
                return BadRequest(new RevokeTokenResponseModel { IsRevoked = false, Errors = ae.Message });
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
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            }
        }

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }
}
