namespace SimplyRecipes.Common.Config
{
    public class ApplicationConfig
    {
        public string Secret { get; set; }

        public string AdministratorUserName { get; set; }

        public string AdministratorEmail { get; set; }

        public string AdministratorPassword { get; set; }

        public string AdministratorFirstName { get; set; }

        public string AdministratorLastName { get; set; }

        public string AdministratorRoleName { get; set; }

        public string UserRoleName { get; set; }

        public string EmailConfirmationSubject { get; set; }

        public string EmailConfirmationContent { get; set; }

        public string ForgotPasswordSubject { get; set; }

        public string ForgotPasswordContent { get; set; }

        public GoogleReCaptcha GoogleReCaptcha { get; set; }
    }
}
