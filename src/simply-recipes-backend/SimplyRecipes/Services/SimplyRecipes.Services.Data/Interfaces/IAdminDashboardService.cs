namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.AdminDashboard;

    public interface IAdminDashboardService
    {
        Dictionary<string, int> GetRegisteredUsersPerMonth();

        Task<Dictionary<string, int>> GetRegisteredAdminsPerMonthAsync();

        Task<List<TopCategoryViewModel>> GetTopCategoriesAsync();

        Task<List<TopRecipeViewModel>> GetTopRecipesAsync();

        Task<List<TopArticleViewModel>> GetTopArticleCommentsAsync();
    }
}
