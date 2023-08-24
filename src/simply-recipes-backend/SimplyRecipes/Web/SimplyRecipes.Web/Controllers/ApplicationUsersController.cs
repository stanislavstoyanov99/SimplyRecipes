namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;
    using SimplyRecipes.Models.ViewModels.CookingHubUsers;
    using SimplyRecipes.Common;

    [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
    public class ApplicationUsersController : ApiController
    {
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly ISimplyRecipesUsersService simplyRecipesUsersService;

        public ApplicationUsersController(
            UserManager<SimplyRecipesUser> userManager,
            ISimplyRecipesUsersService simplyRecipesUsersService)
        {
            this.userManager = userManager;
            this.simplyRecipesUsersService = simplyRecipesUsersService;
        }

        [HttpGet("all")]
        public async Task<ActionResult> All()
        {
            try
            {
                var users = await this.simplyRecipesUsersService
                    .GetAllSimplyRecipesUsersAsync<SimplyRecipesUserDetailsViewModel>();

                foreach (var currUser in users)
                {
                    currUser.Role = await this.simplyRecipesUsersService
                        .GetCurrentUserRoleNameAsync(currUser, currUser.Id);
                }

                return this.Ok(users);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
        }

        [HttpPut("edit")]
        public async Task<ActionResult> Edit([FromBody] SimplyRecipesUserEditViewModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(model);
            }

            try
            {
                var user = await this.userManager.FindByIdAsync(model.UserId);

                await this.userManager.RemoveFromRoleAsync(user, model.RoleName);

                await this.userManager.AddToRoleAsync(user, model.NewRole);

                var viewModel = await this.simplyRecipesUsersService
                    .GetViewModelByIdAsync<SimplyRecipesUserDetailsViewModel>(model.UserId);
                viewModel.Role = model.NewRole;

                return this.Ok(viewModel);
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

        [HttpDelete("ban/{id}")]
        public async Task<ActionResult> Ban(string id)
        {
            try
            {
                var user = await this.simplyRecipesUsersService.BanByIdAsync(id);

                user.Role = await this.simplyRecipesUsersService
                    .GetCurrentUserRoleNameAsync(user, user.Id);

                return this.Ok(user);
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

        [HttpDelete("unban/{id}")]
        public async Task<ActionResult> Unban(string id)
        {
            try
            {
                var user = await this.simplyRecipesUsersService.UnbanByIdAsync(id);

                user.Role = await this.simplyRecipesUsersService
                    .GetCurrentUserRoleNameAsync(user, user.Id);

                return this.Ok(user);
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
    }
}
