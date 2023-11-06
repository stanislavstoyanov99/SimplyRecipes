namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.InputModels.Administration.Recipes;
    using SimplyRecipes.Models.ViewModels.Recipes;

    public interface IRecipesService : IBaseDataService
    {
        Task<RecipeDetailsViewModel> CreateAsync(RecipeCreateInputModel recipeCreateInputModel, string userId);

        Task<RecipeDetailsViewModel> EditAsync(RecipeEditViewModel recipeEditViewModel);

        Task<IEnumerable<TViewModel>> GetAllAsync<TViewModel>();

        IQueryable<TViewModel> GetAllAsQueryeable<TViewModel>();

        IQueryable<TViewModel> GetAllByFilterAsQueryeable<TViewModel>(string categoryName = null);

        Task<IEnumerable<TViewModel>> GetTopAsync<TViewModel>(int count = 0);

        Task<IEnumerable<TViewModel>> GetAllByUserId<TViewModel>(string userId);
    }
}
