namespace SimplyRecipes.Models.ViewModels.Identity
{
    using SimplyRecipes.Models.Common;
    using System.ComponentModel.DataAnnotations;

    public class RegisterRequestModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [MaxLength(ModelValidation.FirstNameMaxLength, ErrorMessage = "The {0} must be max {1} characters long.")]
        [MinLength(ModelValidation.FirstNameMinLength, ErrorMessage = "The {0} must be min {1} characters long.")]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(ModelValidation.LastNameMaxLength, ErrorMessage = "The {0} must be max {1} characters long.")]
        [MinLength(ModelValidation.LastNameMinLength, ErrorMessage = "The {0} must be min {1} characters long.")]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }

        [Required]
        public string Gender { get; set; }
    }
}
