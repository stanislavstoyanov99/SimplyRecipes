namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.Faq;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using SimplyRecipes.Models.InputModels.Administration.Faq;

    public class FaqController : ApiController
    {
        private readonly IFaqService faqService;

        public FaqController(IFaqService faqService)
        {
            this.faqService = faqService;
        }

        [HttpGet("all")]
        public async Task<ActionResult> All()
        {
            var faqs = await this.faqService.GetAllFaqsAsync<FaqDetailsViewModel>();

            return this.Ok(faqs);
        }

        [HttpPost("submit")]
        [Authorize]
        public async Task<ActionResult> Submit([FromBody] FaqCreateInputModel faqCreateInputModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(faqCreateInputModel);
            }

            var faq = await this.faqService.CreateAsync(faqCreateInputModel);

            return this.Ok(faq);
        }

        [HttpPut("edit")]
        [Authorize]
        public async Task<ActionResult> Edit([FromBody] FaqEditViewModel faqEditViewModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(faqEditViewModel);
            }

            var faq = await this.faqService.EditAsync(faqEditViewModel);

            return this.Ok(faq);
        }

        [HttpDelete("remove/{id}")]
        [Authorize]
        public async Task<ActionResult> Remove(int id)
        {
            await this.faqService.DeleteByIdAsync(id);

            return this.Ok();
        }
    }
}
