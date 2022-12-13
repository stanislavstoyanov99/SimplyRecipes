namespace SimplyRecipes.Models.ViewModels.Identity
{
    public class AuthenticateResponseModel
    {
        public AuthenticateResponseModel(string token, bool isAuthSuccessful)
        {
            this.Token = token;
            this.IsAuthSuccessful = isAuthSuccessful;
        }

        public string Token { get; private set; }

        public bool IsAuthSuccessful { get; set; }
    }
}
