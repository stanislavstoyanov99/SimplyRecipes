namespace SimplyRecipes.Models.ViewModels.ExternalAuth
{
    public class AuthenticateFbRequestModel
    {
        public string FacebookAccessToken { get; set; }

        public string FacebookIdentifier { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }
    }
}
