namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult> All([FromQuery] int? pageNumber)
        {
            try
            {
                var users = this.simplyRecipesUsersService
                    .GetAllSimplyRecipesUsersAsQueryeable<SimplyRecipesUserDetailsViewModel>();

                foreach (var currUser in users)
                {
                    currUser.Role = await this.simplyRecipesUsersService
                        .GetCurrentUserRoleNameAsync(currUser, currUser.Id);
                }

                var usersPaginated = await PaginatedList<SimplyRecipesUserDetailsViewModel>
                    .CreateAsync(users, pageNumber ?? 1, PageSize);

                var responseModel = new PaginatedViewModel<SimplyRecipesUserDetailsViewModel>
                {
                    Items = usersPaginated,
                    PageNumber = pageNumber ?? 1,
                    PageSize = PageSize,
                    Count = await users.CountAsync()
                };

                return this.Ok(responseModel);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
        }

        [HttpPut("edit")]
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
