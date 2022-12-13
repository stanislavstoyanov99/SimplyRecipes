namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Models.Enumerations;
    using SimplyRecipes.Models.ViewModels.Identity;
    using SimplyRecipes.Services.Data.Interfaces;

    public class IdentityService : IIdentityService
    {
        private readonly IDeletableEntityRepository<SimplyRecipesUser> users;
        private readonly IOptions<ApplicationConfig> appConfig;
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly IJwtService jwtService;

        public IdentityService(
            IDeletableEntityRepository<SimplyRecipesUser> users,
            IOptions<ApplicationConfig> appConfig,
            UserManager<SimplyRecipesUser> userManager,
            IJwtService jwtService)
        {
            this.users = users;
            this.appConfig = appConfig;
            this.userManager = userManager;
            this.jwtService = jwtService;
        }

        public async Task<AuthenticateResponseModel> LoginAsync(LoginRequestModel model)
        {
            var user = await this.userManager.FindByNameAsync(model.UserName);

            if (user == null || !await this.userManager.CheckPasswordAsync(user, model.Password))
            {
                throw new NullReferenceException("User does not exist.");
            }

            var roles = await this.userManager.GetRolesAsync(user);

            var token = this.jwtService.GenerateToken(user.Id, user.UserName, roles);

            if (token == null)
            {
                throw new NullReferenceException("Missing JWT token.");
            }

            return new AuthenticateResponseModel(token, true);
        }

        public async Task<IdentityResult> RegisterAsync(RegisterRequestModel model)
        {
            // TODO: get this from Angular checkbox Enum.TryParse<Gender>(this.Input.SelectedGender, out Gender gender);

            if (model.Password != model.ConfirmPassword)
            {
                throw new ArgumentException("Confirm password is different from password.");
            }

            var user = new SimplyRecipesUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Gender = Gender.Male,
            };

            var identityResult = await this.userManager.CreateAsync(user, model.Password);

            if (!identityResult.Succeeded)
            {
                throw new ArgumentException(string.Join(", ", identityResult.Errors.Select(e => e.Description)));
            }

            identityResult = await this.userManager
                .AddToRoleAsync(user, appConfig.Value.UserRoleName);

            if (!identityResult.Succeeded)
            {
                throw new ArgumentException(string.Join(", ", identityResult.Errors.Select(e => e.Description)));
            }

            return identityResult;
        }
    }
}
