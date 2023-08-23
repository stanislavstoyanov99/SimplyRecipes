namespace SimplyRecipes.Web.Controllers
{
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

        [HttpGet("privacy/{id}")]
        public async Task<ActionResult> Privacy(int id)
        {
            var privacy = await this.privacyService.GetViewModelByIdAsync<PrivacyDetailsViewModel>(id);

            return this.Ok(privacy);
        }

        [HttpPost("submit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit([FromBody] PrivacyCreateInputModel privacyCreateInputModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(privacyCreateInputModel);
            }

            var privacy = await this.privacyService.CreateAsync(privacyCreateInputModel);
            return this.Ok(privacy);
        }

        [HttpPut("edit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Edit([FromBody] PrivacyEditViewModel privacyEditViewModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(privacyEditViewModel);
            }

            var privacy = await this.privacyService.EditAsync(privacyEditViewModel);

            return this.Ok(privacy);
        }

        [HttpDelete("remove/{id}")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Remove(int id)
        {
            await this.privacyService.DeleteByIdAsync(id);

            return this.Ok();
        }
    }
}
