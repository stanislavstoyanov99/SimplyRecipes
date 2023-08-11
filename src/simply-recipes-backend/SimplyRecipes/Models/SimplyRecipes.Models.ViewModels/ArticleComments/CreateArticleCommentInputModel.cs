namespace SimplyRecipes.Models.ViewModels.ArticleComments
{
    using System.ComponentModel.DataAnnotations;

    using static SimplyRecipes.Data.Common.DataValidation.ArticleCommentValidation;
    using static SimplyRecipes.Models.Common.ModelValidation;

    public class CreateArticleCommentInputModel
    {
        public int ArticleId { get; set; }

        public int? ParentId { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [MaxLength(ContentMaxLength)]
        public string Content { get; set; }
    }
}
