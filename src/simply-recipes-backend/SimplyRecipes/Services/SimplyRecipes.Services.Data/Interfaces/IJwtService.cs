namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;

    public interface IJwtService
    {
        string GenerateToken(string userId, string userName, IEnumerable<string> roles = null);
    }
}
