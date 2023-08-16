﻿namespace SimplyRecipes.Models.ViewModels.Articles
{
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Data.Models;

    using Microsoft.AspNetCore.Http;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.ArticleValidation;

    public class ArticleEditViewModel : IMapFrom<Article>
    {
        public int Id { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(TitleMaxLength, MinimumLength = TitleMinLength, ErrorMessage = TitleLengthError)]
        public string Title { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(DescriptionMaxLength, MinimumLength = DescriptionMinLength, ErrorMessage = DescriptionLengthError)]
        public string Description { get; set; }

        [DataType(DataType.Url)]
        [StringLength(ImageMaxLength, MinimumLength = ImageMinLength, ErrorMessage = ImagePathError)]
        public string ImagePath { get; set; }

        [DataType(DataType.Upload)]
        public IFormFile Image { get; set; }

        [Display(Name = nameof(Category))]
        public int CategoryId { get; set; }
    }
}
