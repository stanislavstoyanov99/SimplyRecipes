namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;

    public interface ISimplyRecipesUsersService
    {
        Task<SimplyRecipesUserDetailsViewModel> BanByIdAsync(string id);

        Task<SimplyRecipesUserDetailsViewModel> UnbanByIdAsync(string id);

        IQueryable<TViewModel> GetAllSimplyRecipesUsersAsQueryeable<TViewModel>();

        Task<TViewModel> GetViewModelByIdAsync<TViewModel>(string id);

        Task<string> GetCurrentUserRoleNameAsync(SimplyRecipesUserDetailsViewModel user, string userId);
    }
}
