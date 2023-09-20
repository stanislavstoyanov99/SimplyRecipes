namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Security.Claims;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Cryptography;
    using System.Threading.Tasks;

    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Common.Repositories;

    public class JwtService : IJwtService
    {
        private readonly IOptions<ApplicationConfig> appConfig;
        private readonly IDeletableEntityRepository<SimplyRecipesUser> users;

        public JwtService(
            IOptions<ApplicationConfig> appConfig,
            IDeletableEntityRepository<SimplyRecipesUser> users)
        {
            this.appConfig = appConfig;
            this.users = users;
        }

        public async Task<RefreshToken> GenerateRefreshTokenAsync(string ipAddress, string userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = await GenerateUniqueTokenAsync(userId),
                ExpirationDate = DateTime.UtcNow.AddDays(this.appConfig.Value.RefreshTokenExpiration),
                CreatedByIp = ipAddress
            };

            return refreshToken;
        }

        public string GenerateToken(string userId, string userName, IEnumerable<string> roles = null)
        {
            var key = Encoding.ASCII.GetBytes(this.appConfig.Value.JwtSecret);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, userName),
            };

            if (roles != null)
            {
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(appConfig.Value.JwtTTL),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private async Task<string> GenerateUniqueTokenAsync(string userId)
        {
            // token is a cryptographically strong random sequence of values
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            // ensure token is unique by checking against db
            var tokenIsUnique = !await this.users
                .All()
                .Include(x => x.RefreshTokens)
                .AnyAsync(x => x.RefreshTokens.Any(t => t.Token == token));

            if (!tokenIsUnique)
            {
                return await this.GenerateUniqueTokenAsync(userId);
            }

            return token;
        }
    }
}
