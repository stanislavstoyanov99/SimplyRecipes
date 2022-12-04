namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface ISimplyRecipesUsersService
    {
        Task BanByIdAsync(string id);

        Task UnbanByIdAsync(string id);

        Task<IEnumerable<TViewModel>> GetAllSimplyRecipesUsersAsync<TViewModel>();

        Task<TViewModel> GetViewModelByIdAsync<TViewModel>(string id);
    }
}
