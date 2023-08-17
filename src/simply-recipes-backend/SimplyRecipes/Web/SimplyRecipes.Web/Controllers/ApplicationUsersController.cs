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
    using System.Linq;

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

            foreach (var currUser in users)
            {
                var userRole = currUser.Roles.FirstOrDefault(x => x.UserId == currUser.Id);
                var currUserRole = await this.roleManager.FindByIdAsync(userRole.RoleId);
                currUser.Role = currUserRole.Name;
            }

            return this.Ok(users);
        }

        [HttpPut("edit")]
        [Authorize]
        public async Task<ActionResult> Edit([FromBody] SimplyRecipesUserEditViewModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(model);
            }

            var user = await this.userManager.FindByIdAsync(model.UserId);

            await this.userManager.RemoveFromRoleAsync(user, model.RoleName);

            await this.userManager.AddToRoleAsync(user, model.NewRole);

            var viewModel = await this.simplyRecipesUsersService
                .GetViewModelByIdAsync<SimplyRecipesUserDetailsViewModel>(model.UserId);
            viewModel.Role = model.NewRole;

            return this.Ok(viewModel);
        }


        [HttpPost("ban")]
        [Authorize]
        public async Task<ActionResult> Ban([FromBody] SimplyRecipesUserDetailsViewModel simplyRecipesUserDetailsViewModel)
        {
            await this.simplyRecipesUsersService.BanByIdAsync(simplyRecipesUserDetailsViewModel.Id);

            return this.Ok();
        }

        [HttpPost("unban")]
        [Authorize]
        public async Task<IActionResult> Unban([FromBody] SimplyRecipesUserDetailsViewModel simplyRecipesUserDetailsViewModel)
        {
            await this.simplyRecipesUsersService.UnbanByIdAsync(simplyRecipesUserDetailsViewModel.Id);

            return this.Ok();
        }
    }
}
