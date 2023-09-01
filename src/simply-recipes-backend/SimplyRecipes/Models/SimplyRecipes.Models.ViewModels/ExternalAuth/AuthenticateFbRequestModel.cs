namespace SimplyRecipes.Models.ViewModels.ExternalAuth
{
    using System.ComponentModel.DataAnnotations;

    public class AuthenticateFbRequestModel
    {
        [Required]
        public string FacebookAccessToken { get; set; }

        [Required]
        public string FacebookIdentifier { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string UserName { get; set; }
    }
}
