namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Identity;

    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;

    public interface ISimplyRecipesUsersService
    {
        Task<SimplyRecipesUserDetailsViewModel> BanByIdAsync(string id);

        Task<SimplyRecipesUserDetailsViewModel> UnbanByIdAsync(string id);

        IQueryable<TViewModel> GetAllAsQueryeable<TViewModel>();

        Task<TViewModel> GetViewModelByIdAsync<TViewModel>(string id);

        Task<string> GetCurrentUserRoleNameAsync(IEnumerable<IdentityUserRole<string>> roles, string userId);
    }
}
