﻿namespace SimplyRecipes.Web.Controllers
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
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route(nameof(Register))]
        public async Task<ActionResult> Register(RegisterRequestModel model)
        {
            try
            {
                if (!this.ModelState.IsValid)
                {
                    return BadRequest(model);
                }

                var result = await this.identityService.RegisterAsync(model);
                var response = new RegisterResponseModel
                {
                    Succeeded = true
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new RegisterResponseModel { Succeeded = false, Errors = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(typeof(LoginResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route(nameof(Login))]
        public async Task<ActionResult> Login(LoginRequestModel model)
        {
            try
            {
                if (!this.ModelState.IsValid)
                {
                    return BadRequest(model);
                }

                var result = await this.identityService.LoginAsync(model);

                return Ok(result);
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
    }
}
