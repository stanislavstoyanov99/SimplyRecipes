﻿namespace SimplyRecipes.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Data.Common.Models;

    using static SimplyRecipes.Data.Common.DataValidation.CategoryValidation;

    public class Category : BaseDeletableModel<int>
    {
        public Category()
        {
            this.Articles = new HashSet<Article>();
            this.Recipes = new HashSet<Recipe>();
        }

        [Required]
        [MaxLength(NameMaxLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(DescriptionMaxLength)]
        public string Description { get; set; }

        public virtual ICollection<Article> Articles { get; set; }

        public virtual ICollection<Recipe> Recipes { get; set; }
    }
}
