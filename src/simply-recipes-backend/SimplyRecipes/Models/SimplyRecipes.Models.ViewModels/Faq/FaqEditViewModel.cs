namespace SimplyRecipes.Models.ViewModels.Faq
{
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Mapping;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.FaqEntryValidation;

    public class FaqEditViewModel : IMapFrom<FaqEntry>
    {
        public int Id { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(QuestionMaxLength, MinimumLength = QuestionMinLength, ErrorMessage = QuestionLengthError)]
        public string Question { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(AnswerMaxLength, MinimumLength = AnswerMinLength, ErrorMessage = AnswerLengthError)]
        public string Answer { get; set; }
    }
}
