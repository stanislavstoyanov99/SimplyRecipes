namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.InputModels.Administration.Articles;
    using SimplyRecipes.Models.ViewModels.Articles;

    public interface IArticlesService : IBaseDataService
    {
        Task<ArticleDetailsViewModel> CreateAsync(ArticleCreateInputModel articlesCreateInputModel, string userId);

        Task<ArticleDetailsViewModel> EditAsync(ArticleEditViewModel articlesEditViewModel, string userId);

        Task<IEnumerable<TViewModel>> GetAllArticlesAsync<TViewModel>();

        IQueryable<TViewModel> GetAllArticlesByCategoryNameAsQueryeable<TViewModel>(string categoryName);

        IQueryable<TViewModel> GetAllArticlesAsQueryeable<TViewModel>();

        Task<IEnumerable<TViewModel>> GetRecentArticlesAsync<TViewModel>(int count = 0);

        IQueryable<ArticleListingViewModel> GetAllArticlesAsQueryeableBySearchQuery(string searchQuery);
    }
}
