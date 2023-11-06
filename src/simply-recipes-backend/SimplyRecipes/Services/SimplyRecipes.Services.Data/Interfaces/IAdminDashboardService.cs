namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.AdminDashboard;

    public interface IAdminDashboardService
    {
        Task<Dictionary<string, int>> GetRegisteredUsersPerMonthAsync();

        Task<Dictionary<string, int>> GetRegisteredAdminsPerMonthAsync();

        Task<List<TopCategoryViewModel>> GetTopCategoriesAsync();

        Task<List<TopRecipeViewModel>> GetTopRecipesAsync();

        Task<List<TopArticleViewModel>> GetTopArticleCommentsAsync();
    }
}
