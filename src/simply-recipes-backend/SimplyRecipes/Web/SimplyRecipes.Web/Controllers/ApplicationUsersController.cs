namespace SimplyRecipes.Web.Controllers
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;
    using SimplyRecipes.Models.ViewModels.CookingHubUsers;

    public class ApplicationUsersController : ApiController
    {
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly ISimplyRecipesUsersService simplyRecipesUsersService;
        private readonly RoleManager<ApplicationRole> roleManager;

        public ApplicationUsersController(
            UserManager<SimplyRecipesUser> userManager,
            ISimplyRecipesUsersService simplyRecipesUsersService,
            RoleManager<ApplicationRole> roleManager)
        {
            this.userManager = userManager;
            this.simplyRecipesUsersService = simplyRecipesUsersService;
            this.roleManager = roleManager;
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<ActionResult> All()
        {
            var users = await this.simplyRecipesUsersService
                .GetAllSimplyRecipesUsersAsync<SimplyRecipesUserDetailsViewModel>();

            return this.Ok(users);
        }

        [HttpPut("edit")]
        [Authorize]
        public async Task<ActionResult> Edit(SimplyRecipesUserEditViewModel model, string id)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(model);
            }

            var user = await this.userManager.FindByIdAsync(id);

            await this.userManager.RemoveFromRoleAsync(user, model.RoleName);

            await this.userManager.AddToRoleAsync(user, model.NewRole);

            return this.Ok();
        }


        [HttpPost("ban")]
        [Authorize]
        public async Task<ActionResult> Ban(SimplyRecipesUserDetailsViewModel simplyRecipesUserDetailsViewModel)
        {
            await this.simplyRecipesUsersService.BanByIdAsync(simplyRecipesUserDetailsViewModel.Id);

            return this.Ok();
        }

        [HttpPost("unban")]
        [Authorize]
        public async Task<IActionResult> Unban(SimplyRecipesUserDetailsViewModel simplyRecipesUserDetailsViewModel)
        {
            await this.simplyRecipesUsersService.UnbanByIdAsync(simplyRecipesUserDetailsViewModel.Id);

            return this.Ok();
        }
    }
}
