namespace SimplyRecipes.Models.ViewModels.CookingHubUsers
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    // using Microsoft.AspNetCore.Mvc.Rendering;

    using static SimplyRecipes.Models.Common.ModelValidation.SimplyRecipesUserValidation;

    public class SimplyRecipesUserEditViewModel
    {
        public string RoleId { get; set; }

        public string RoleName { get; set; }

        [Required(ErrorMessage = RoleSelectedError)]
        public string NewRole { get; set; }

        // public List<SelectListItem> RolesList { get; set; }
    }
}
