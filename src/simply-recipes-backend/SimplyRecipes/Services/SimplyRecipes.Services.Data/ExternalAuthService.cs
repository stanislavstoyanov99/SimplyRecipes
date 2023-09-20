namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.ExternalAuth;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;

    public class ExternalAuthService : IExternalAuthService
    {
        private readonly IJwtService jwtService;
        private readonly IOptions<ApplicationConfig> appConfig;
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly IDeletableEntityRepository<SimplyRecipesUser> users;
        private readonly IDeletableEntityRepository<FacebookIdentifierLogin> facebookLogins;

        public ExternalAuthService(
            IJwtService jwtService,
            IOptions<ApplicationConfig> appConfig,
            UserManager<SimplyRecipesUser> userManager,
            IDeletableEntityRepository<SimplyRecipesUser> users,
            IDeletableEntityRepository<FacebookIdentifierLogin> facebookLogins)
        {
            this.jwtService = jwtService;
            this.appConfig = appConfig;
            this.userManager = userManager;
            this.users = users;
            this.facebookLogins = facebookLogins;
        }

        public async Task<ExternalAuthAuthenticateResponseModel> AuthenticateWithFbAsync(AuthenticateFbRequestModel model)
        {
            SimplyRecipesUser fbUser = null;

            if (!await this.IsAuthenticatedWithFbAsync(model.FacebookAccessToken, model.FacebookIdentifier))
            {
                fbUser = new SimplyRecipesUser
                {
                    UserName = model.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email
                };

                var identityResult = await this.userManager.CreateAsync(fbUser, model.FacebookAccessToken);

                if (!identityResult.Succeeded)
                {
                    throw new ArgumentException(string.Join(", ", identityResult.Errors.Select(e => e.Description)));
                }

                identityResult = await this.userManager.AddToRoleAsync(fbUser, appConfig.Value.UserRoleName);

                if (!identityResult.Succeeded)
                {
                    throw new ArgumentException(string.Join(", ", identityResult.Errors.Select(e => e.Description)));
                }

                var login = new FacebookIdentifierLogin
                {
                    FacebookIdentifier = model.FacebookIdentifier,
                    UserId = fbUser.Id,
                    User = fbUser
                };

                await this.facebookLogins.AddAsync(login);
                await this.facebookLogins.SaveChangesAsync();
            }
            else
            {
                var facebookLogin = await this.facebookLogins
                    .All()
                    .FirstOrDefaultAsync(x => x.FacebookIdentifier == model.FacebookIdentifier);

                fbUser = await this.users
                    .All()
                    .FirstOrDefaultAsync(x => x.Id == facebookLogin.UserId);
            }

            var token = await this.GenerateJwtTokenAsync(fbUser);

            if (token == null)
            {
                throw new NullReferenceException(ExceptionMessages.MissingJWTToken);
            }

            var responseModel = new ExternalAuthAuthenticateResponseModel
            {
                UserId = fbUser.Id,
                Email = fbUser.Email,
                Username = fbUser.UserName,
                IsAdmin = await this.userManager.IsInRoleAsync(fbUser, appConfig.Value.AdministratorRoleName),
                Token = token,
                IsAuthSuccessful = true
            };

            return responseModel;
        }

        private async Task<string> GenerateJwtTokenAsync(SimplyRecipesUser user)
        {
            var roles = await this.userManager.GetRolesAsync(user);

            return this.jwtService.GenerateToken(user.Id, user.UserName, roles);
        }

        private async Task<bool> IsAuthenticatedWithFbAsync(string facebookAccessToken, string facebookIdentifier)
        {
            var httpClient = new HttpClient();
            var httpResponse = await httpClient.GetAsync($"https://graph.facebook.com/me?access_token={facebookAccessToken}");

            if (!httpResponse.IsSuccessStatusCode)
            {
                throw new ArgumentException(httpResponse.Content.ToString());
            }

            var isAuthenticated = await this.facebookLogins
                .All()
                .AnyAsync(x => x.FacebookIdentifier == facebookIdentifier);

            if (!isAuthenticated)
            {
                return false;
            }

            return true;
        }
    }
}
