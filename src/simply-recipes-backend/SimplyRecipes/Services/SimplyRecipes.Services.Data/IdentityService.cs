namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Models.Enumerations;
    using SimplyRecipes.Models.ViewModels.Identity;
    using SimplyRecipes.Services.Data.Interfaces;

    public class IdentityService : IIdentityService
    {
        private readonly IOptions<ApplicationConfig> appConfig;
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly SignInManager<SimplyRecipesUser> signInManager;
        private readonly IJwtService jwtService;

        public IdentityService(
            IOptions<ApplicationConfig> appConfig,
            UserManager<SimplyRecipesUser> userManager,
            SignInManager<SimplyRecipesUser> signInManager,
            IJwtService jwtService)
        {
            this.appConfig = appConfig;
            this.userManager = userManager;
            this.jwtService = jwtService;
            this.signInManager = signInManager;
        }

        public async Task<LoginResponseModel> LoginAsync(LoginRequestModel model)
        {
            var user = await this.userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                throw new NullReferenceException("User does not exist.");
            }

            if (!await this.userManager.CheckPasswordAsync(user, model.Password))
            {
                throw new ArgumentException("Invalid username or password.");
            }

            var roles = await this.userManager.GetRolesAsync(user);

            var token = this.jwtService.GenerateToken(user.Id, user.UserName, roles);

            if (token == null)
            {
                throw new NullReferenceException("Missing JWT token.");
            }

            var result = await this.signInManager
                .PasswordSignInAsync(model.UserName, model.Password, true, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                var isAdmin = await this.userManager.IsInRoleAsync(user, appConfig.Value.AdministratorRoleName);

                return new LoginResponseModel
                {
                    UserId = user.Id,
                    Email = user.Email,
                    Username = user.UserName,
                    IsAdmin = isAdmin,
                    IsAuthSuccessful = result.Succeeded,
                    Token = token,
                };
            }
            else
            {
                return new LoginResponseModel
                {
                    IsAuthSuccessful = false
                };
            }
        }

        public async Task<IdentityResult> RegisterAsync(RegisterRequestModel model)
        {
            // TODO: get this from Angular checkbox Enum.TryParse<Gender>(this.Input.SelectedGender, out Gender gender);

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
