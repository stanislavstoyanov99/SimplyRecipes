namespace SimplyRecipes.Services.Data
{
    using System.Threading.Tasks;

    using Microsoft.Extensions.Options;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.Contacts;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Messaging;

    public class ContactsService : IContactsService
    {
        private readonly IRepository<ContactFormEntry> userContactsRepository;
        private readonly IEmailSender emailSender;
        private readonly IOptions<ApplicationConfig> appConfig;

        public ContactsService(
            IRepository<ContactFormEntry> userContactsRepository,
            IEmailSender emailSender,
            IOptions<ApplicationConfig> appConfig)
        {
            this.userContactsRepository = userContactsRepository;
            this.emailSender = emailSender;
            this.appConfig = appConfig;
        }

        public async Task SendContactToAdminAsync(ContactFormEntryViewModel contactFormEntryViewModel)
        {
            var contactFormEntry = new ContactFormEntry
            {
                FirstName = contactFormEntryViewModel.FirstName,
                LastName = contactFormEntryViewModel.LastName,
                Email = contactFormEntryViewModel.Email,
                Subject = contactFormEntryViewModel.Subject,
                Content = contactFormEntryViewModel.Content,
            };

            await this.userContactsRepository.AddAsync(contactFormEntry);
            await this.userContactsRepository.SaveChangesAsync();

            await this.emailSender.SendEmailAsync(
                contactFormEntryViewModel.Email,
                string.Concat(contactFormEntryViewModel.FirstName, " ", contactFormEntryViewModel.LastName),
                this.appConfig.Value.AdministratorEmail,
                contactFormEntryViewModel.Subject,
                contactFormEntryViewModel.Content);
        }
    }
}
