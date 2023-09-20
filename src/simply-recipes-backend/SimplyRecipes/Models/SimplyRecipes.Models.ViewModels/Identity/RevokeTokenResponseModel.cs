namespace SimplyRecipes.Models.ViewModels.Identity
{
    public class RevokeTokenResponseModel
    {
        public bool IsRevoked { get; set; }

        public string Errors { get; set; }
    }
}
