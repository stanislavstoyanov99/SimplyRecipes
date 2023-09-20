namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Models.ViewModels.Contacts;
    using SimplyRecipes.Services.Data.Interfaces;

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
            try
            {
                await this.contactsService.SendContactToAdminAsync(contactFormViewModel);

                return this.Ok();

            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
        }
    }
}
