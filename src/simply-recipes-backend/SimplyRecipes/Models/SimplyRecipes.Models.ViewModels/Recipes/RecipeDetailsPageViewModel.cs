namespace SimplyRecipes.Models.ViewModels.Recipes
{
    using SimplyRecipes.Models.ViewModels.Reviews;

    public class RecipeDetailsPageViewModel
    {
        public RecipeDetailsViewModel Recipe { get; set; }

        public CreateReviewInputModel CreateReviewInputModel { get; set; }
    }
}
