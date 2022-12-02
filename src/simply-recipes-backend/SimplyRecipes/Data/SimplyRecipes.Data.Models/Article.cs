﻿namespace SimplyRecipes.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Data.Common.Models;

    using static SimplyRecipes.Data.Common.DataValidation.ArticleValidation;

    public class Article : BaseDeletableModel<int>
    {
        public Article()
        {
            this.ArticleComments = new HashSet<ArticleComment>();
        }

        [Required]
        [MaxLength(TitleMaxLength)]
        public string Title { get; set; }

        [Required]
        [MaxLength(DescriptionMaxLength)]
        public string Description { get; set; }

        [Required]
        [MaxLength(ImagePathMaxLength)]
        public string ImagePath { get; set; }

        public virtual Category Category { get; set; }

        public int CategoryId { get; set; }

        [Required]
        public string UserId { get; set; }

        public virtual SimplyRecipesUser User { get; set; }

        public virtual ICollection<ArticleComment> ArticleComments { get; set; }
    }
}
