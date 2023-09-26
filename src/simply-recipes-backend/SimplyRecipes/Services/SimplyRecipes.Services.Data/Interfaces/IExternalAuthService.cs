namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.ExternalAuth;

    public interface IExternalAuthService
    {
        Task<ExternalAuthAuthenticateResponseModel> AuthenticateWithFbAsync(AuthenticateFbRequestModel model, string ipAddress);
    }
}
