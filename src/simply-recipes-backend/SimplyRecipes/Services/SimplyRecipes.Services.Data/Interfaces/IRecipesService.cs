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

        Task EditAsync(RecipeEditViewModel recipeEditViewModel);

        Task<IEnumerable<TViewModel>> GetAllRecipesAsync<TViewModel>();

        IQueryable<TViewModel> GetAllRecipesAsQueryeable<TViewModel>();

        IQueryable<TViewModel> GetAllRecipesByFilterAsQueryeable<TViewModel>(string categoryName = null);

        Task<IEnumerable<TViewModel>> GetTopRecipesAsync<TViewModel>(int count = 0);

        Task<IEnumerable<TViewModel>> GetAllRecipesByUserId<TViewModel>(string userId);

        Task<TViewModel> GetRecipeAsync<TViewModel>(string name);
    }
}
