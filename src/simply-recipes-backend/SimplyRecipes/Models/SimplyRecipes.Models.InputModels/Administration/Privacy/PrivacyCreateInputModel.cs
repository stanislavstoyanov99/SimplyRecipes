namespace SimplyRecipes.Models.InputModels.Administration.Privacy
{
    using System.ComponentModel.DataAnnotations;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.PrivacyValidation;

    public class PrivacyCreateInputModel
    {
        [Display(Name = PageContentDisplayName)]
        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(PageContentMaxLength, MinimumLength = PageContentMinLength, ErrorMessage = PageContentLengthError)]
        public string PageContent { get; set; }
    }
}
