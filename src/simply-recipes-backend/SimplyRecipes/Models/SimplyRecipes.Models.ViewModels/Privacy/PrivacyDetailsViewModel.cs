namespace SimplyRecipes.Models.ViewModels.Privacy
{
    using System.ComponentModel.DataAnnotations;
    using Ganss.Xss;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Mapping;

    using static SimplyRecipes.Models.Common.ModelValidation.PrivacyValidation;

    public class PrivacyDetailsViewModel : IMapFrom<Privacy>
    {
        public int Id { get; set; }

        [Display(Name = PageContentDisplayName)]
        public string PageContent { get; set; }

        public string SanitizedPageContent => new HtmlSanitizer().Sanitize(this.PageContent);
    }
}
