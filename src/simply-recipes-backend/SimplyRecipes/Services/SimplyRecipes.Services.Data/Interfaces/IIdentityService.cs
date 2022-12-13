namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;
    using SimplyRecipes.Models.ViewModels.Identity;

    public interface IIdentityService
    {
        Task<AuthenticateResponseModel> LoginAsync(LoginRequestModel model);

        Task<IdentityResult> RegisterAsync(RegisterRequestModel model);
    }
}
