namespace SimplyRecipes.Common.Config
{
    public class ApplicationConfig
    {
        public string JwtSecret { get; set; }

        // jwt time to live (in minutes)
        public int JwtTTL { get; set; }

        // refresh token time to live (in days), inactive tokens are
        // automatically deleted from the database after this time
        public int RefreshTokenTTL { get; set; }

        // refresh token expiration time (in days)
        public int RefreshTokenExpiration { get; set; }

        public string AdministratorUserName { get; set; }

        public string AdministratorEmail { get; set; }

        public string AdministratorPassword { get; set; }

        public string AdministratorFirstName { get; set; }

        public string AdministratorLastName { get; set; }

        public string AdministratorRoleName { get; set; }

        public string UserRoleName { get; set; }

        public GoogleReCaptcha GoogleReCaptcha { get; set; }

        public string FacebookAppId { get; set; }

        public string FacebookAppSecret { get; set; }
    }
}
