﻿namespace SimplyRecipes.Models.InputModels.Administration.Recipes
{
    using System;
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Data.Models;

    using Microsoft.AspNetCore.Http;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.RecipeValidation;

    public class RecipeCreateInputModel
    {
        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(NameMaxLength, MinimumLength = NameMinLength, ErrorMessage = NameLengthError)]
        public string Name { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(DescriptionMaxLength, MinimumLength = DescriptionMinLength, ErrorMessage = DescriptionError)]
        public string Description { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [StringLength(IngredientsMaxLength, MinimumLength = IngredientsMinLength, ErrorMessage = IngredientsError)]
        public string Ingredients { get; set; }

        [Display(Name = PreparationTimeDisplayName)]
        [Range(PreparationTimeMinLength, PreparationTimeMaxLength)]
        public double PreparationTime { get; set; }

        [Display(Name = CookingTimeDisplayName)]
        [Range(CookingTimeMinLength, CookingTimeMaxLength)]
        public double CookingTime { get; set; }

        [Display(Name = PortionsNumberDisplayName)]
        [Range(PortionsMinLength, PortionsMaxLength)]
        public int PortionsNumber { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        public string Difficulty { get; set; }

        public string ImagePath { get; set; }

        //[Required(ErrorMessage = EmptyFieldLengthError)]
        //[DataType(DataType.Upload)]
        //public IFormFile Image { get; set; }

        [Required(ErrorMessage = EmptyFieldLengthError)]
        [Display(Name = nameof(Category))]
        public int CategoryId { get; set; }
    }
}
