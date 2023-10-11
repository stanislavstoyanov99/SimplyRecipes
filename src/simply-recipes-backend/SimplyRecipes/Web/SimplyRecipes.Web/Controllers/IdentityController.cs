namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common;
    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Models.ViewModels.Identity;
    using SimplyRecipes.Services.Data.Interfaces;

    public class IdentityController : ApiController
    {
        private readonly IIdentityService identityService;
        private readonly IOptions<ApplicationConfig> appConfig;

        public IdentityController(
            IIdentityService identityService,
            IOptions<ApplicationConfig> appConfig)
        {
            this.identityService = identityService;
            this.appConfig = appConfig;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RegisterResponseModel), StatusCodes.Status400BadRequest)]
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
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> Login(LoginRequestModel model)
        {
            try
            {
                var ipAddress = Utils.GetIpAddress(Request.Headers, HttpContext.Connection.RemoteIpAddress);
                var response = await this.identityService.LoginAsync(model, ipAddress);

                var cookieOptions = Utils.CreateTokenCookie(this.appConfig.Value.RefreshTokenExpiration);
                Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

                return Ok(response);
            }
            catch (NullReferenceException nre)
            {
                return Unauthorized(new LoginResponseModel { IsAuthSuccessful = false, Errors = nre.Message });
            }
            catch (ArgumentException ae)
            {
                return Unauthorized(new LoginResponseModel { IsAuthSuccessful = false, Errors = ae.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];

                var ipAddress = Utils.GetIpAddress(Request.Headers, HttpContext.Connection.RemoteIpAddress);
                var response = await this.identityService.RefreshTokenAsync(refreshToken, ipAddress);

                var cookieOptions = Utils.CreateTokenCookie(this.appConfig.Value.RefreshTokenExpiration);
                Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

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
        [HttpPost("revoke-token")]
        [ProducesResponseType(typeof(RevokeTokenResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RevokeTokenResponseModel), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> RevokeToken(RevokeTokenRequestModel model)
        {
            try
            {
                var token = model.Token ?? Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new RevokeTokenResponseModel
                        { 
                            IsRevoked = false,
                            Errors = "Token is required." 
                        });
                }

                var ipAddress = Utils.GetIpAddress(Request.Headers, HttpContext.Connection.RemoteIpAddress);
                var response = await this.identityService.RevokeToken(token, ipAddress);

                return Ok(response);
            }
            catch (ArgumentException ae)
            {
                return BadRequest(new RevokeTokenResponseModel { IsRevoked = false, Errors = ae.Message });
            }
        }
    }
}
