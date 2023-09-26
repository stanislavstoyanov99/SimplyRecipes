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
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;

    public class IdentityService : IIdentityService
    {
        private readonly IOptions<ApplicationConfig> appConfig;
        private readonly UserManager<SimplyRecipesUser> userManager;
        private readonly SignInManager<SimplyRecipesUser> signInManager;
        private readonly IJwtService jwtService;
        private readonly IDeletableEntityRepository<SimplyRecipesUser> users;
        private readonly IRepository<RefreshToken> refreshTokens;

        public IdentityService(
            IOptions<ApplicationConfig> appConfig,
            UserManager<SimplyRecipesUser> userManager,
            SignInManager<SimplyRecipesUser> signInManager,
            IJwtService jwtService,
            IDeletableEntityRepository<SimplyRecipesUser> users,
            IRepository<RefreshToken> refreshTokens)
        {
            this.appConfig = appConfig;
            this.userManager = userManager;
            this.jwtService = jwtService;
            this.signInManager = signInManager;
            this.users = users;
            this.refreshTokens = refreshTokens;
        }

        public async Task<LoginResponseModel> LoginAsync(LoginRequestModel model, string ipAddress)
        {
            var user = await this.userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                throw new NullReferenceException(ExceptionMessages.MissingUser);
            }

            if (!await this.userManager.CheckPasswordAsync(user, model.Password))
            {
                throw new ArgumentException(ExceptionMessages.InvalidCredentials);
            }

            var roles = await this.userManager.GetRolesAsync(user);

            var token = this.jwtService.GenerateToken(user.Id, user.UserName, roles);
            if (token == null)
            {
                throw new NullReferenceException(ExceptionMessages.MissingJWTToken);
            }

            var refreshToken = await this.jwtService.GenerateRefreshTokenAsync(ipAddress, user.Id);
            if (refreshToken == null)
            {
                throw new NullReferenceException(ExceptionMessages.MissingJWTRefreshToken);
            }

            user.RefreshTokens.Add(refreshToken);

            this.users.Update(user);
            await this.users.SaveChangesAsync();

            RemoveOldRefreshTokens(user);
            await this.users.SaveChangesAsync();

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
                    RefreshToken = refreshToken.Token,
                    Token = token
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
            if (!Enum.TryParse(model.Gender, true, out Gender gender))
            {
                throw new ArgumentException(
                    string.Format(ExceptionMessages.GenderInvalidType, model.Gender));
            }

            var user = new SimplyRecipesUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Gender = gender,
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

        public async Task<LoginResponseModel> RefreshTokenAsync(string token, string ipAddress)
        {
            var user = await this.GetUserByRefreshTokenAsync(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (refreshToken.IsRevoked)
            {
                // revoke all descendant tokens in case this token has been compromised
                RevokeDescendantRefreshTokens(refreshToken, user, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");

                this.refreshTokens.Update(refreshToken);
                await this.refreshTokens.SaveChangesAsync();
            }

            if (!refreshToken.IsActive)
            {
                throw new ArgumentException(ExceptionMessages.InvalidToken);
            }

            // replace old refresh token with a new one (rotate token)
            var newRefreshToken = await RotateRefreshTokenAsync(refreshToken, ipAddress, user.Id);
            user.RefreshTokens.Add(newRefreshToken);

            this.users.Update(user);
            await this.users.SaveChangesAsync();

            RemoveOldRefreshTokens(user);
            await this.users.SaveChangesAsync();

            var roles = await this.userManager.GetRolesAsync(user);
            var jwtToken = this.jwtService.GenerateToken(user.Id, user.UserName, roles);
            if (jwtToken == null)
            {
                throw new NullReferenceException(ExceptionMessages.MissingJWTToken);
            }

            var isAdmin = await this.userManager.IsInRoleAsync(user, appConfig.Value.AdministratorRoleName);

            return new LoginResponseModel
            {
                UserId = user.Id,
                Email = user.Email,
                Username = user.UserName,
                IsAdmin = isAdmin,
                IsAuthSuccessful = true,
                Token = jwtToken,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task<RevokeTokenResponseModel> RevokeToken(string token, string ipAddress)
        {
            var user = await this.GetUserByRefreshTokenAsync(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
            {
                throw new ArgumentException(ExceptionMessages.InvalidToken);
            }

            RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");

            this.refreshTokens.Update(refreshToken);
            await this.refreshTokens.SaveChangesAsync();

            var response = new RevokeTokenResponseModel { IsRevoked = true };

            return response;
        }

        private void RemoveOldRefreshTokens(SimplyRecipesUser user)
        {
            var refreshTokens = user.RefreshTokens.ToList();

            // remove old inactive refresh tokens from user based on TTL in app settings
            refreshTokens.RemoveAll(x =>
                !x.IsActive &&
                x.CreatedOn.AddDays(appConfig.Value.RefreshTokenTTL) <= DateTime.UtcNow);
        }

        private async Task<SimplyRecipesUser> GetUserByRefreshTokenAsync(string token)
        {
            var user = await this.users
                .All()
                .Include(x => x.RefreshTokens)
                .SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

            if (user == null)
            {
                throw new ArgumentException(ExceptionMessages.InvalidToken);
            }

            return user;
        }

        private void RevokeDescendantRefreshTokens(RefreshToken refreshToken, SimplyRecipesUser user, string ipAddress, string reason)
        {
            // recursively traverse the refresh token chain and ensure all descendants are revoked
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);

                if (childToken.IsActive)
                {
                    RevokeRefreshToken(childToken, ipAddress, reason);
                }
                else
                {
                    RevokeDescendantRefreshTokens(childToken, user, ipAddress, reason);
                }
            }
        }

        private void RevokeRefreshToken(RefreshToken token, string ipAddress, string reason = null, string replacedByToken = null)
        {
            token.RevokedDate = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }

        private async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken refreshToken, string ipAddress, string userId)
        {
            var newRefreshToken = await this.jwtService.GenerateRefreshTokenAsync(ipAddress, userId);
            RevokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);

            return newRefreshToken;
        }
    }
}
