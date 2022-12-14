namespace SimplyRecipes.Models.ViewModels.Identity
{
    public class LoginResponseModel
    {
        public string Token { get; set; }

        public bool IsAuthSuccessful { get; set; }

        public string Errors { get; set; }
    }
}
