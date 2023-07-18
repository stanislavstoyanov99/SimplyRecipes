namespace SimplyRecipes.Models.ViewModels.Recipes
{
    using System.Collections.Generic;

    using SimplyRecipes.Models.ViewModels.Categories;

    public class RecipeListViewModel
    {
        public IEnumerable<RecipeDetailsViewModel> Recipes { get; set; }

        public IEnumerable<CategoryDetailsViewModel> Categories { get; set; }
    }
}
