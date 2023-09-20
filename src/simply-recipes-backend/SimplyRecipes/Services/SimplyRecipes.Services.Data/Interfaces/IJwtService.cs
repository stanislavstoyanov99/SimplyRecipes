namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Models;

    public interface IJwtService
    {
        string GenerateToken(string userId, string userName, IEnumerable<string> roles = null);

        Task<RefreshToken> GenerateRefreshTokenAsync(string ipAddress, string userId);
    }
}
