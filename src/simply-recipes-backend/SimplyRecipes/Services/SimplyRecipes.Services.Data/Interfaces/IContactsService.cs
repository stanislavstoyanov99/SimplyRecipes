namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.Contacts;

    public interface IContactsService
    {
        Task SendContactToAdminAsync(ContactFormEntryViewModel contactFormEntryViewModel);
    }
}
