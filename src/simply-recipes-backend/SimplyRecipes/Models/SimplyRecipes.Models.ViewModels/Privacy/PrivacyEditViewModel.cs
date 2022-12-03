namespace SimplyRecipes.Models.ViewModels.Privacy
{
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Mapping;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.PrivacyValidation;

    public class PrivacyEditViewModel : IMapFrom<Privacy>
    {
        public int Id { get; set; }

        [Display(Name = PageContentDisplayName)]
        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(PageContentMaxLength, MinimumLength = PageContentMinLength, ErrorMessage = PageContentLengthError)]
        public string PageContent { get; set; }
    }
}
