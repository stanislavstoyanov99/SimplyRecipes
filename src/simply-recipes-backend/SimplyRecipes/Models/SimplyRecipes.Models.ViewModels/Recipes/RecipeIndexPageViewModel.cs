namespace SimplyRecipes.Models.ViewModels.Recipes
{
    using System.Collections.Generic;

    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Models.ViewModels.Reviews;

    public class RecipeIndexPageViewModel
    {
        public PaginatedList<RecipeListingViewModel> RecipesPaginated { get; set; }

        public IEnumerable<CategoryListingViewModel> Categories { get; set; }

        public IEnumerable<ReviewListingViewModel> Reviews { get; set; }
    }
}
