namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.InputModels.Administration.Faq;
    using SimplyRecipes.Models.ViewModels.Faq;

    public interface IFaqService : IBaseDataService
    {
        Task<FaqDetailsViewModel> CreateAsync(FaqCreateInputModel faqCreateInputModel);

        Task<FaqDetailsViewModel> EditAsync(FaqEditViewModel faqEditViewModel);

        Task<IEnumerable<TEntity>> GetAllAsync<TEntity>();
    }
}
