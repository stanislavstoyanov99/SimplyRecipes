namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.Contacts;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Mvc;

    public class ContactsController : ApiController
    {
        private readonly IContactsService contactsService;

        public ContactsController(IContactsService contactsService)
        {
            this.contactsService = contactsService;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ContactFormEntryViewModel contactFormViewModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(contactFormViewModel);
            }

            await this.contactsService.SendContactToAdminAsync(contactFormViewModel);

            return this.Ok();
            //return this.RedirectToAction("ThankYou");
        }
    }
}
