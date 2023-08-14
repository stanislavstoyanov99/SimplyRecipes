namespace SimplyRecipes.Models.ViewModels.Reviews
{
    using System.ComponentModel.DataAnnotations;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.ReviewValidation;

    public class CreateReviewInputModel
    {
        [Required(ErrorMessage = EmptyFieldLengthError)]
        [MaxLength(TitleMaxLength)]
        [MinLength(TitleMinLength)]
        public string Title { get; set; }

        public int RecipeId { get; set; }

        public int Rate { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [MaxLength(ContentMaxLength)]
        [MinLength(ContentMinLength)]
        public string Content { get; set; }
    }
}
