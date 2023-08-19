namespace SimplyRecipes.Services.Data.Interfaces
{
    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface ISimplyRecipesUsersService
    {
        Task<SimplyRecipesUserDetailsViewModel> BanByIdAsync(string id);

        Task<SimplyRecipesUserDetailsViewModel> UnbanByIdAsync(string id);

        Task<IEnumerable<TViewModel>> GetAllSimplyRecipesUsersAsync<TViewModel>();

        Task<TViewModel> GetViewModelByIdAsync<TViewModel>(string id);
    }
}
