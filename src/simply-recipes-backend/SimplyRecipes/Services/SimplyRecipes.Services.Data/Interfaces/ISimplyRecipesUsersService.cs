namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;

    public interface ISimplyRecipesUsersService
    {
        Task<SimplyRecipesUserDetailsViewModel> BanByIdAsync(string id);

        Task<SimplyRecipesUserDetailsViewModel> UnbanByIdAsync(string id);

        Task<IEnumerable<TViewModel>> GetAllSimplyRecipesUsersAsync<TViewModel>();

        Task<TViewModel> GetViewModelByIdAsync<TViewModel>(string id);

        Task<string> GetCurrentUserRoleNameAsync(SimplyRecipesUserDetailsViewModel user, string userId);
    }
}
