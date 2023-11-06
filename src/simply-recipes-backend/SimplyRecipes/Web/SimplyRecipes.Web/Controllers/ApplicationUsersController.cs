namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;
    using SimplyRecipes.Models.ViewModels.CookingHubUsers;
    using SimplyRecipes.Common;
    using SimplyRecipes.Models.Common;
    using SimplyRecipes.Models.ViewModels;

    [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
    public class ApplicationUsersController : ApiController
    {
        private const int PageSize = 10;

        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly ISimplyRecipesUsersService simplyRecipesUsersService;

        public ApplicationUsersController(
            UserManager<SimplyRecipesUser> userManager,
            ISimplyRecipesUsersService simplyRecipesUsersService)
        {
            this.userManager = userManager;
            this.simplyRecipesUsersService = simplyRecipesUsersService;
        }

        [HttpGet("get-all")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<SimplyRecipesUserDetailsViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> All([FromQuery] int? pageNumber)
        {
            var users = this.simplyRecipesUsersService
                .GetAllAsQueryeable<SimplyRecipesUserDetailsViewModel>();

            var usersPaginated = await PaginatedList<SimplyRecipesUserDetailsViewModel>
                .CreateAsync(users, pageNumber ?? 1, PageSize);

            foreach (var currUser in usersPaginated)
            {
                currUser.Role = await this.simplyRecipesUsersService
                    .GetCurrentUserRoleNameAsync(currUser.Roles, currUser.Id);
            }

            var responseModel = new PaginatedViewModel<SimplyRecipesUserDetailsViewModel>
            {
                Items = usersPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = PageSize,
                Count = usersPaginated.Count
            };

            return this.Ok(responseModel);
        }

        [HttpPut("edit")]
        [ProducesResponseType(typeof(SimplyRecipesUserDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Edit([FromBody] SimplyRecipesUserEditViewModel model)
        {
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
        [ProducesResponseType(typeof(SimplyRecipesUserDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Ban(string id)
        {
            try
            {
                var user = await this.simplyRecipesUsersService.BanByIdAsync(id);

                user.Role = await this.simplyRecipesUsersService
                    .GetCurrentUserRoleNameAsync(user.Roles, user.Id);

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
        [ProducesResponseType(typeof(SimplyRecipesUserDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Unban(string id)
        {
            try
            {
                var user = await this.simplyRecipesUsersService.UnbanByIdAsync(id);

                user.Role = await this.simplyRecipesUsersService
                    .GetCurrentUserRoleNameAsync(user.Roles, user.Id);

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
