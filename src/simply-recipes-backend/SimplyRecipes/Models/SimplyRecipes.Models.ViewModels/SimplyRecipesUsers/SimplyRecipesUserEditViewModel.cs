namespace SimplyRecipes.Models.ViewModels.CookingHubUsers
{
    using System.ComponentModel.DataAnnotations;

    using static SimplyRecipes.Models.Common.ModelValidation.SimplyRecipesUserValidation;

    public class SimplyRecipesUserEditViewModel
    {
        public string UserId { get; set; }

        public string RoleName { get; set; }

        [Required(ErrorMessage = RoleSelectedError)]
        public string NewRole { get; set; }
    }
}
