namespace SimplyRecipes.Models.ViewModels.ExternalAuth
{
    using Newtonsoft.Json;

    public class ExternalAuthAuthenticateResponseModel
    {
        public string UserId { get; set; }

        public string Email { get; set; }

        public string Username { get; set; }

        public bool IsAdmin { get; set; }

        public string Token { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }

        public bool IsAuthSuccessful { get; set; }

        public string Errors { get; set; }
    }
}
