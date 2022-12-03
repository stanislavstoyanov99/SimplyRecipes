namespace SimplyRecipes.Models.ViewModels.Categories
{
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Data.Models;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.CategoryValidation;

    public class CategoryEditViewModel : IMapFrom<Category>
    {
        public int Id { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(NameMaxLength, MinimumLength = NameMinLength, ErrorMessage = NameLengthError)]
        public string Name { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(DescriptionMaxLength, MinimumLength = DescriptionMinLength, ErrorMessage = DescriptionError)]
        public string Description { get; set; }
    }
}
