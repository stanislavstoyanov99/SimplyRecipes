namespace SimplyRecipes.Models.ViewModels.Identity
{
    public class LoginResponseModel
    {
        public string UserId { get; set; }

        public string Email { get; set; }

        public string Username { get; set; }

        public bool IsAdmin { get; set; }

        public string Token { get; set; }

        public bool IsAuthSuccessful { get; set; }

        public string Errors { get; set; }
    }
}
