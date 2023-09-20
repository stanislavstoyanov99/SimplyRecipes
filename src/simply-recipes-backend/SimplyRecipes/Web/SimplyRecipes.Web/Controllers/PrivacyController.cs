namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Common;
    using SimplyRecipes.Models.InputModels.Administration.Privacy;
    using SimplyRecipes.Models.ViewModels.Privacy;
    using SimplyRecipes.Services.Data.Interfaces;

    public class PrivacyController : ApiController
    {
        private readonly IPrivacyService privacyService;

        public PrivacyController(IPrivacyService privacyService)
        {
            this.privacyService = privacyService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Privacy(int id)
        {
            try
            {
                var privacy = await this.privacyService.GetViewModelByIdAsync<PrivacyDetailsViewModel>(id);

                return this.Ok(privacy);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpPost("submit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit([FromBody] PrivacyCreateInputModel privacyCreateInputModel)
        {
            try
            {
                var privacy = await this.privacyService.CreateAsync(privacyCreateInputModel);
                return this.Ok(privacy);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpPut("edit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Edit([FromBody] PrivacyEditViewModel privacyEditViewModel)
        {
            try
            {
                var privacy = await this.privacyService.EditAsync(privacyEditViewModel);

                return this.Ok(privacy);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
