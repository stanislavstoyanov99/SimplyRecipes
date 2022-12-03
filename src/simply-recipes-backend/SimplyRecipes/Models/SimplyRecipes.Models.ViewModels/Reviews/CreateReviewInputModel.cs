namespace SimplyRecipes.Models.ViewModels.Reviews
{
    using System.ComponentModel.DataAnnotations;

    using static SimplyRecipes.Models.Common.ModelValidation;

    public class CreateReviewInputModel
    {
        [Required(ErrorMessage = EmptyFieldLengthError)]
        public string Title { get; set; }

        public int RecipeId { get; set; }

        public int Rate { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        public string Content { get; set; }

        public string UserId { get; set; }
    }
}
