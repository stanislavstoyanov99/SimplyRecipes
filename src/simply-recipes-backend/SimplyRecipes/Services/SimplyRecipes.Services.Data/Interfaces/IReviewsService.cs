namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.ViewModels.Reviews;

    public interface IReviewsService
    {
        public Task<ReviewDetailsViewModel> CreateAsync(CreateReviewInputModel createReviewInputModel, string userId);

        public Task<IEnumerable<TViewModel>> GetAll<TViewModel>(int recipeId);

        public Task<IEnumerable<TViewModel>> GetTopReviews<TViewModel>();

        public Task<int> DeleteReviewByIdAsync(int id);
    }
}
