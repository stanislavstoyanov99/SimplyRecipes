namespace SimplyRecipes.Models.InputModels.Administration.Articles
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Models.ViewModels.Categories;
    using Microsoft.AspNetCore.Http;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.ArticleValidation;

    public class ArticleCreateInputModel
    {
        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(TitleMaxLength, MinimumLength = TitleMinLength, ErrorMessage = TitleLengthError)]
        public string Title { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(DescriptionMaxLength, MinimumLength = DescriptionMinLength, ErrorMessage = DescriptionLengthError)]
        public string Description { get; set; }

        [DataType(DataType.Url)]
        [StringLength(ImageMaxLength, MinimumLength = ImageMinLength, ErrorMessage = ImagePathError)]
        public string ImagePath { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [DataType(DataType.Upload)]
        public IFormFile Image { get; set; }

        [Display(Name = CategoryDisplayName)]
        public int CategoryId { get; set; }
    }
}
