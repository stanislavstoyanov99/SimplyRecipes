namespace SimplyRecipes.Data.Models
{
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Data.Common.Models;

    using static SimplyRecipes.Data.Common.DataValidation.PrivacyValidation;

    public class Privacy : BaseDeletableModel<int>
    {
        [Required]
        [MaxLength(ContentPageMaxLength)]
        public string PageContent { get; set; }
    }
}
