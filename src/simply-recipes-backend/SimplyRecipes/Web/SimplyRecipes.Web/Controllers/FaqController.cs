namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.Faq;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Mvc;

    public class FaqController : Controller
    {
        private readonly IFaqService faqService;

        public FaqController(IFaqService faqService)
        {
            this.faqService = faqService;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var responseModel = await this.faqService.GetAllFaqsAsync<FaqDetailsViewModel>();

            return this.Ok(responseModel);
        }
    }
}
