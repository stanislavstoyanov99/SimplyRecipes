namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;

    using SimplyRecipes.Models.ViewModels.Identity;

    public interface IIdentityService
    {
        Task<LoginResponseModel> LoginAsync(LoginRequestModel model, string ipAddress);

        Task<IdentityResult> RegisterAsync(RegisterRequestModel model);

        Task<LoginResponseModel> RefreshTokenAsync(string token, string ipAddress);

        Task<RevokeTokenResponseModel> RevokeToken(string token, string ipAddress);
    }
}
