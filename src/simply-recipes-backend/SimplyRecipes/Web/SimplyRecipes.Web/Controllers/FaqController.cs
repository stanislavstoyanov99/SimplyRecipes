namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Common;
    using SimplyRecipes.Models.ViewModels.Faq;
    using SimplyRecipes.Models.InputModels.Administration.Faq;
    using SimplyRecipes.Services.Data.Interfaces;

    public class FaqController : ApiController
    {
        private readonly IFaqService faqService;

        public FaqController(IFaqService faqService)
        {
            this.faqService = faqService;
        }

        [HttpGet("all")]
        [ProducesResponseType(
            typeof(IEnumerable<FaqDetailsViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> All()
        {
            var faqs = await this.faqService.GetAllFaqsAsync<FaqDetailsViewModel>();

            return this.Ok(faqs);
        }

        [HttpPost("submit")]
        [ProducesResponseType(typeof(FaqDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit([FromBody] FaqCreateInputModel faqCreateInputModel)
        {
            try
            {
                var faq = await this.faqService.CreateAsync(faqCreateInputModel);

                return this.Ok(faq);
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
        [ProducesResponseType(typeof(FaqDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Edit([FromBody] FaqEditViewModel faqEditViewModel)
        {
            try
            {
                var faq = await this.faqService.EditAsync(faqEditViewModel);

                return this.Ok(faq);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpDelete("remove/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Remove(int id)
        {
            try
            {
                await this.faqService.DeleteByIdAsync(id);

                return this.Ok();
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
