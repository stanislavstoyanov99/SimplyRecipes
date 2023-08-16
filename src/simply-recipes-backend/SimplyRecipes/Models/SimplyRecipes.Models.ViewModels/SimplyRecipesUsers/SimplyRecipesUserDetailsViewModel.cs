namespace SimplyRecipes.Models.ViewModels.SimplyRecipesUsers
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Models.Enumerations;

    using static SimplyRecipes.Models.Common.ModelValidation;
    using static SimplyRecipes.Models.Common.ModelValidation.SimplyRecipesUserValidation;

    public class SimplyRecipesUserDetailsViewModel : IMapFrom<SimplyRecipesUser>
    {
        [Display(Name = IdDisplayName)]
        public string Id { get; set; }

        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        [Display(Name = CreatedOnDisplayName)]
        public DateTime CreatedOn { get; set; }

        public bool IsDeleted { get; set; }

        public Gender Gender { get; set; }

        public IEnumerable<ApplicationRole> UserRoles { get; set; }
    }
}
