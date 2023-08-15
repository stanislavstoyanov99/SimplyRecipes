namespace SimplyRecipes.Common.Config
{
    public class ApplicationConfig
    {
        public string JwtSecret { get; set; }

        public string AdministratorUserName { get; set; }

        public string AdministratorEmail { get; set; }

        public string AdministratorPassword { get; set; }

        public string AdministratorFirstName { get; set; }

        public string AdministratorLastName { get; set; }

        public string AdministratorRoleName { get; set; }

        public string UserRoleName { get; set; }

        public GoogleReCaptcha GoogleReCaptcha { get; set; }
    }
}
