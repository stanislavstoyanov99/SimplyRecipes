namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;

    using SimplyRecipes.Models.InputModels.Administration.Privacy;
    using SimplyRecipes.Models.ViewModels.Privacy;

    public interface IPrivacyService : IBaseDataService
    {
        Task<PrivacyDetailsViewModel> CreateAsync(PrivacyCreateInputModel privacyCreateInputModel);

        Task EditAsync(PrivacyEditViewModel privacyEditViewModel);

        Task<TViewModel> GetViewModelAsync<TViewModel>();
    }
}
